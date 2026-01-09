import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFullImageUrl } from "../utils/imageUtils";
import axios from "axios";
import config from "../config/config";

const CategorySliderUpdated = ({ onCategoryClick }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [allSliderItems, setAllSliderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gapPx, setGapPx] = useState(40);
  const [itemWidthPx, setItemWidthPx] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Touch/mouse state
  const startX = useRef(null);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const autoplayRef = useRef(null);

  // Fetch categories and settings from slider API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch slider categories
        const sliderRes = await axios.get(`${config.API_URL}/api/categories/slider`);
        const sliderData = sliderRes.data || [];
        
        // Fetch custom slider items (admin-created promotional items)
        let customSliderItems = [];
        try {
          const customRes = await axios.get(`${config.API_URL}/api/custom-slider-items/active`);
          customSliderItems = customRes.data || [];
        } catch (customErr) {
          console.log("No custom slider items or error fetching them:", customErr);
        }
        
        // If admin selected categories exist, use them
        let regularCategories = [];
        if (Array.isArray(sliderData) && sliderData.length > 0) {
          regularCategories = sliderData.filter((c) => c && c.isActive !== false && !c.isDeleted);
        } else {
          // Fallback: fetch all categories
          const allRes = await axios.get(`${config.API_URL}/api/categories`);
          const allData = allRes.data || [];
          regularCategories = allData.filter((c) => c && c.isActive !== false && !c.isDeleted);
        }
        
        setCategories(regularCategories);
        setCustomItems(customSliderItems);
        
        // Merge custom items and regular categories
        const mergedItems = [
          ...customSliderItems.map(item => ({
            ...item,
            isCustomItem: true,
            type: 'custom'
          })),
          ...regularCategories.map(cat => ({
            ...cat,
            isCustomItem: false,
            type: 'category'
          }))
        ];
        
        setAllSliderItems(mergedItems);
        
      } catch (err) {
        console.error("Error fetching slider data:", err);
        // Fallback on error
        try {
          const allRes = await axios.get(`${config.API_URL}/api/categories`);
          const allData = allRes.data || [];
          const regularCategories = allData.filter((c) => c && c.isActive !== false && !c.isDeleted);
          setCategories(regularCategories);
          setAllSliderItems(regularCategories.map(cat => ({
            ...cat,
            isCustomItem: false,
            type: 'category'
          })));
        } catch (fallbackErr) {
          console.error("Error fetching fallback categories:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateLayout = useCallback(() => {
    const w = window.innerWidth;
    let vc = 2;

    if (w >= 2560) {
      vc = 8;
    } else if (w >= 1920) {
      vc = 7;
    } else if (w >= 1536) {
      vc = 6;
    } else if (w >= 1280) {
      vc = 5;
    } else if (w >= 1024) {
      vc = 5;
    } else if (w >= 768) {
      vc = 3;
    } else if (w >= 640) {
      vc = 2;
    }

    setVisibleCount(vc);

    let g = 24;
    if (w >= 1536) {
      g = 40;
    } else if (w >= 1024) {
      g = 32;
    }
    setGapPx(g);

    const container = containerRef.current;
    if (container) {
      const cw = container.offsetWidth;
      const itemW = (cw - g * (vc - 1)) / vc;
      setItemWidthPx(Math.max(0, itemW));
    }
  }, []);

  // Update visible count and compute exact item width to remove extra spacing
  useEffect(() => {
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]);

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => updateLayout());
    return () => cancelAnimationFrame(id);
  }, [loading, allSliderItems.length, updateLayout]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeTouchMove = (e) => {
      if (isDragging.current && startX.current !== null) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', handleNativeTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchmove', handleNativeTouchMove, { passive: false });
    };
  }, []);

  const handleNext = () => {
    if (allSliderItems && allSliderItems.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % allSliderItems.length);
    }
  };

  const handlePrev = () => {
    if (allSliderItems && allSliderItems.length > 0) {
      setCurrentIndex((prev) =>
        prev - 1 < 0 ? allSliderItems.length - 1 : prev - 1
      );
    }
  };

  // --- Smooth Drag Logic ---
  const getItemWidth = () => {
    if (itemWidthPx != null) return itemWidthPx;
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    return containerWidth / visibleCount;
  };

  const animateAndSetIndex = (direction) => {
    setIsAnimating(true);
    const offset = direction === 'next' ? -getItemWidth() : getItemWidth();
    setDragOffset(offset);
    setTimeout(() => {
      setIsAnimating(false);
      setDragOffset(0);
      if (direction === 'next') handleNext();
      else handlePrev();
    }, 200);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    isDragging.current = true;
    setDragging(true);
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const touch = e.touches[0];
    const diff = touch.clientX - startX.current;
    // Limit drag so you can't drag beyond the width of one item
    const maxDrag = getItemWidth();
    const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
    setDragOffset(limitedDiff);
  };
  const handleTouchEnd = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const touch = e.changedTouches[0];
    const diff = touch.clientX - startX.current;
    const threshold = getItemWidth() / 3;
    if (diff < -threshold) {
      animateAndSetIndex('next');
    } else if (diff > threshold) {
      animateAndSetIndex('prev');
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    isDragging.current = true;
    startX.current = e.clientX;
    setDragging(true);
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const diff = e.clientX - startX.current;
    setDragOffset(diff);
  };
  const handleMouseUp = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const diff = e.clientX - startX.current;
    const threshold = getItemWidth() / 3;
    if (diff < -threshold) {
      animateAndSetIndex('next');
    } else if (diff > threshold) {
      animateAndSetIndex('prev');
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };
  const handleMouseLeave = () => {
    if (isDragging.current) {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };

  // Keyboard navigation and focus pause
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      animateAndSetIndex('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      animateAndSetIndex('prev');
    }
  };

  // Autoplay with pause on hover/drag/focus
  useEffect(() => {
    const shouldAutoplay = !isHovered && !dragging && !isAnimating && (allSliderItems?.length ?? 0) > 1;
    if (shouldAutoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % (allSliderItems?.length || 1));
      }, 3000);
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isHovered, dragging, isAnimating, allSliderItems?.length]);

  // Compute visible items in order, as a loop
  const getVisibleCategories = () => {
    if (!allSliderItems || allSliderItems.length === 0) return [];
    const maxToShow = Math.min(visibleCount, allSliderItems.length);
    const visible = [];
    for (let i = 0; i < maxToShow; i++) {
      const item = allSliderItems[(currentIndex + i) % allSliderItems.length];
      if (item) {
        visible.push(item);
      }
    }
    return visible;
  };

  if (loading) {
    return (
      <section className="mb-5 bg-white">
        <div className="max-w-8xl lg:px-3">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  if (allSliderItems.length === 0) {
    return null;
  }

  const visibleCategories = getVisibleCategories();

  const progressPercent = allSliderItems && allSliderItems.length > 0
    ? ((currentIndex % allSliderItems.length) / allSliderItems.length) * 100
    : 0;

  // --- Style for smooth transform ---
  const sliderStyle = {
    transform: `translateX(${dragOffset}px)`,
    transition: isDragging.current || isAnimating ? 'transform 0.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
  };

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
        {/* group to control hover for arrows */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex-1 overflow-hidden outline-none"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Product categories"
            aria-live="polite"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <div
              ref={trackRef}
              className="flex items-center gap-6 lg:gap-8 transition-transform duration-300 ease-in-out"
              style={sliderStyle}
            >
              {visibleCategories.map((item, index) => {
                // Handle click based on item type
                const handleItemClick = () => {
                  if (item.isCustomItem) {
                    // Custom item - redirect to specified URL
                    if (item.redirectUrl) {
                      window.location.href = item.redirectUrl;
                    }
                  } else {
                    // Regular category - pass the full item object
                    if (onCategoryClick) {
                      onCategoryClick(item);
                    }
                  }
                };

                return (
                  <button
                    key={(item._id || item.id) + '-' + index}
                    onClick={handleItemClick}
                    className="flex flex-col items-center group/item flex-shrink-0 focus:outline-none"
                    style={{ flex: itemWidthPx != null ? `0 0 ${itemWidthPx}px` : undefined, width: itemWidthPx == null ? `${100 / visibleCount}%` : undefined }}
                  >
                    <div
                      className="flex items-center justify-center w-full"
                      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                    >
                      {item && item.image ? (
                        <div
                          className="relative p-1.5 rounded-full shadow-[0_10px_25px_-10px_rgba(217,168,46,0.5)]"
                          style={{ backgroundColor: '#E2EDF4', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                        >
                          <div className="rounded-full overflow-hidden w-28 h-28 md:w-40 md:h-40 lg:w-36 lg:h-36 xl:w-36 xl:h-36 bg-white p-5">
                            <img
                              src={getFullImageUrl(item.image)}
                              alt={item.name || 'Category'}
                              loading="lazy"
                              className="w-full h-full bg-contain transform transition-transform duration-300 ease-out group-hover/item:scale-105 group-focus-within/item:scale-105"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="relative p-1.5 rounded-full shadow-[0_10px_25px_-10px_rgba(217,168,46,0.5)]"
                          style={{ backgroundColor: '#E2EDF4', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                        >
                          <div className="rounded-full w-28 h-28 md:w-40 md:h-40 lg:w-36 lg:h-36 xl:w-36 xl:h-36 flex items-center justify-center bg-[#111] text-white transform transition-transform duration-300 ease-out group-hover/item:scale-105 group-focus-within/item:scale-105">
                            <span className="text-xl md:text-2xl">📦</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Label pill */}
                    <div
                      className="mt-5 w-[85%] max-w-[320px] rounded-full py-3 px-5 text-center shadow-lg"
                      style={{ backgroundColor: '#E2EDF4', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.25)' }}
                    >
                      <div className="text-sm md:text-base font-semibold text-black truncate" style={{maxWidth: '140px'}}>
                        {item?.name && item.name.length > 12
                          ? item.name.slice(0, 12) + '...'
                          : item?.name || 'Category'}
                      </div>
                      {(() => {
                        const count = item?.productCount ?? item?.count ?? item?.productsCount ?? item?.totalProducts
                        if (typeof count === 'number') {
                          return <div className="text-[12px] md:text-sm text-black/70 mt-0.5">{count} Products</div>
                        }
                        return null
                      })()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overlay arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-xl md:opacity-0 md:pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto hover:brightness-95"
            style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-xl md:opacity-0 md:pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto hover:brightness-95"
            style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Progress bar */}
          <div className="mt-6 mx-auto w-[85%] max-w-[980px] h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: '#d9a82e' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySliderUpdated;