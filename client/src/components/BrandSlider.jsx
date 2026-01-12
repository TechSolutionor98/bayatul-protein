
// import React, { useState, useEffect, useRef } from "react";

// const BrandSlider = ({ brands = [], onBrandClick, initialIndex = 0 }) => {
//   const [brandIndex, setBrandIndex] = useState(initialIndex);
//   const [visibleCount, setVisibleCount] = useState(8);
//   const sliderRef = useRef(null);
//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);

//   // Responsive count update
//   useEffect(() => {
//     const updateVisible = () => {
//       if (window.innerWidth < 768) setVisibleCount(3);
//       else if (window.innerWidth < 1024) setVisibleCount(6);
//       else if (window.innerWidth < 1536) setVisibleCount(8);
//       else setVisibleCount(10); // 10 logos on 2XL screens (1536px and above)
//     };
//     updateVisible();
//     window.addEventListener("resize", updateVisible);
//     return () => window.removeEventListener("resize", updateVisible);
//   }, []);

//   // Auto-scroll
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBrandIndex((prev) => (prev + 1) % brands.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [brands.length]);

//   // Get visible brands in infinite loop
//   const getVisibleBrands = () => {
//     let visible = [];
//     for (let i = 0; i < visibleCount; i++) {
//       visible.push(brands[(brandIndex + i) % brands.length]);
//     }
//     return visible;
//   };

//   // Dragging handlers
//   const handleMouseDown = (e) => {
//     isDragging.current = true;
//     startX.current = e.pageX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleMouseLeave = () => {
//     isDragging.current = false;
//   };

//   const handleMouseUp = () => {
//     isDragging.current = false;
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchStart = (e) => {
//     isDragging.current = true;
//     startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleTouchMove = (e) => {
//     if (!isDragging.current) return;
//     const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchEnd = () => {
//     isDragging.current = false;
//   };

//   return (
//     <section className="bg-white py-8">
//       <div className="max-w-8xl mx-auto">
//         <div className="relative mb-6">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">Featured Brands</h2>
//         </div>
//         <div className="relative mx-3 md:mx-5">
//           <div
//             className="flex overflow-x-hidden no-scrollbar space-x-2"
//             ref={sliderRef}
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {getVisibleBrands().map((brand, index) => (
//               <div
//                 key={`${brand._id}-${index}`}
//                 className="flex-shrink-0"
//                 style={{ width: "180px" }}
//               >
//                 <div className="px-2 md:px-3">
//                   <button
//                     onClick={() => onBrandClick && onBrandClick(brand.name)}
//                     className="flex flex-col items-center group transition-all duration-300 w-full"
//                   >
//                     <div className="w-22 h-22 md:w-26 md:h-26 lg:w-40 lg:h-40 overflow-hidden flex items-center justify-center ">
//                       <img
//                         src={brand.logo || "/placeholder.svg"}
//                         alt={brand.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BrandSlider;


// =============

// import React, { useState, useEffect, useRef } from "react";

// const BrandSlider = ({ brands = [], onBrandClick, initialIndex = 0 }) => {
//   const [brandIndex, setBrandIndex] = useState(initialIndex);
//   const [visibleCount, setVisibleCount] = useState(8);
//   const [isMobile, setIsMobile] = useState(false);
//   const sliderRef = useRef(null);
//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);

//   // Update visible count + isMobile on resize
//   useEffect(() => {
//     const updateVisible = () => {
//       const width = window.innerWidth;
//       if (width < 768) {
//         setVisibleCount(brands.length); // Show all on mobile
//         setIsMobile(true);
//       } else {
//         setIsMobile(false);
//         if (width < 1024) setVisibleCount(6);
//         else if (width < 1536) setVisibleCount(8);
//         else setVisibleCount(10);
//       }
//     };
//     updateVisible();
//     window.addEventListener("resize", updateVisible);
//     return () => window.removeEventListener("resize", updateVisible);
//   }, [brands.length]);

//   // Auto-scroll effect (mobile scrollLeft / desktop brandIndex)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isMobile && sliderRef.current) {
//         const container = sliderRef.current;
//         const scrollAmount = 180 + 8; // card width + spacing

//         // If end reached, scroll back to start
//         if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 1) {
//           container.scrollTo({ left: 0, behavior: "smooth" });
//         } else {
//           container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//         }
//       } else {
//         // Desktop: use brandIndex logic
//         setBrandIndex((prev) => (prev + 1) % brands.length);
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [brands.length, isMobile]);

//   // Get visible brands for desktop only
//   const getVisibleBrands = () => {
//     const visible = [];
//     for (let i = 0; i < visibleCount; i++) {
//       visible.push(brands[(brandIndex + i) % brands.length]);
//     }
//     return visible;
//   };

//   // Mouse drag (desktop)
//   const handleMouseDown = (e) => {
//     isDragging.current = true;
//     startX.current = e.pageX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };
//   const handleMouseLeave = () => (isDragging.current = false);
//   const handleMouseUp = () => (isDragging.current = false);
//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   // Touch drag (mobile)
//   const handleTouchStart = (e) => {
//     if (!isMobile) return;
//     isDragging.current = true;
//     startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleTouchMove = (e) => {
//     if (!isMobile || !isDragging.current) return;
//     const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchEnd = () => {
//     isDragging.current = false;
//   };

//   return (
//     <section className="bg-white py-8">
//       <div className="max-w-8xl mx-auto">
//         <div className="relative mb-6">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
//             Featured Brands
//           </h2>
//         </div>
//         <div className="relative mx-3 md:mx-5">
//           <div
//             className="flex overflow-x-hidden no-scrollbar space-x-2"
//             ref={sliderRef}
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {(isMobile ? brands : getVisibleBrands()).map((brand, index) => (
//               <div
//                 key={`${brand._id}-${index}`}
//                 className="flex-shrink-0"
//                 style={{ width: "180px" }}
//               >
//                 <div className="px-2 md:px-3">
//                   <button
//                     onClick={() => onBrandClick && onBrandClick(brand.name)}
//                     className="flex flex-col items-center group transition-all duration-300 w-full"
//                   >
//                     <div className="w-22 h-22 md:w-26 md:h-26 lg:w-40 lg:h-40 overflow-hidden flex items-center justify-center">
//                       <img
//                         src={brand.logo || "/placeholder.svg"}
//                         alt={brand.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BrandSlider;


// =================


import React, { useState, useEffect, useRef } from "react";
import { getFullImageUrl } from "../utils/imageUtils";

const BrandSlider = ({ brands = [], categories = [], onBrandClick, onCategoryClick, initialIndex = 0 }) => {
  const [brandIndex, setBrandIndex] = useState(initialIndex);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Debug: log what we receive
  useEffect(() => {
    console.log('BrandSlider - brands:', brands);
    console.log('BrandSlider - categories:', categories);
    console.log('BrandSlider - categories with level:', categories.map(c => ({ 
      name: c.name, 
      level: c.level,
      _id: c._id
    })));
  }, [brands, categories]);

  // Show all categories without filtering by level
  const filteredCategories = categories;

  console.log('BrandSlider - filteredCategories:', filteredCategories);

  const itemsToShow = filteredCategories.length > 0 ? filteredCategories : brands;
  // Create enough duplicates to ensure continuous scrolling (at least 5x to handle various screen sizes)
  const duplicatedItems = itemsToShow.length > 0 
    ? [...itemsToShow, ...itemsToShow, ...itemsToShow, ...itemsToShow, ...itemsToShow] 
    : [];

  // Update visible count + isMobile
  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(itemsToShow.length);
        setIsMobile(true);
      } else {
        setIsMobile(false);
        if (width < 1024) setVisibleCount(6);
        else if (width < 1536) setVisibleCount(8);
        else setVisibleCount(10);
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [itemsToShow.length]);

  // Auto-scroll with smooth loop (both mobile and desktop)
  useEffect(() => {
    if (itemsToShow.length === 0) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const container = sliderRef.current;
        const isMobileView = window.innerWidth < 768;
        const cardWidth = isMobileView ? container.offsetWidth / 2 : 200;
        const gap = 12; // space-x-3
        const scrollAmount = cardWidth + gap;
        const singleSetWidth = itemsToShow.length * scrollAmount;
        
        // Reset when we reach halfway through duplicated items
        if (container.scrollLeft >= singleSetWidth * 2.5) {
          // Reset to beginning of second set (instant, no animation)
          container.scrollLeft = singleSetWidth;
          // Then immediately continue smooth scroll
          setTimeout(() => {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }, 10);
        } else {
          // Normal smooth scroll
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [itemsToShow.length]);

  // Handle infinite scroll wrap on mouse drag end
  const handleScrollWrap = () => {
    if (!sliderRef.current || isMobile) return;
    
    const container = sliderRef.current;
    const scrollAmount = 200 + 24;
    const singleSetWidth = itemsToShow.length * scrollAmount;
    
    // If scrolled too far right, wrap to middle set
    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft = singleSetWidth;
    }
    // If scrolled too far left, wrap to middle set
    else if (container.scrollLeft <= 0) {
      container.scrollLeft = singleSetWidth;
    }
  };

  // Initialize scroll position to middle set for seamless looping
  useEffect(() => {
    if (sliderRef.current && itemsToShow.length > 0) {
      const isMobileView = window.innerWidth < 768;
      const cardWidth = isMobileView ? sliderRef.current.offsetWidth / 2 : 200;
      const gap = 12;
      const scrollAmount = cardWidth + gap;
      const singleSetWidth = itemsToShow.length * scrollAmount;
      sliderRef.current.scrollLeft = singleSetWidth; // Start at second set for seamless loop
    }
  }, [itemsToShow.length]);

  // Get visible items for desktop
  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(itemsToShow[(brandIndex + i) % itemsToShow.length]);
    }
    return visible;
  };

  // Mouse (desktop) scroll
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
    handleScrollWrap();
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    handleScrollWrap();
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Touch (mobile) scroll
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (isMobile) handleScrollWrap();
  };

  // Arrow navigation
  const handlePrevClick = () => {
    if (sliderRef.current) {
      const isMobileView = window.innerWidth < 768;
      const cardWidth = isMobileView ? sliderRef.current.offsetWidth / 2 : 200;
      const gap = 12; // space-x-3
      const scrollAmount = cardWidth + gap;
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(handleScrollWrap, 300);
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      const isMobileView = window.innerWidth < 768;
      const cardWidth = isMobileView ? sliderRef.current.offsetWidth / 2 : 200;
      const gap = 12; // space-x-3
      const scrollAmount = cardWidth + gap;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(handleScrollWrap, 300);
    }
  };

  return (
    <section className="bg-white  py-12 md:py-16">
      <div className="max-w-8xl mx-auto">
        <div className="relative mb-8 md:mb-10">
          <div className="text-center">
            <div className="inline-block">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {filteredCategories.length > 0 ? 'Featured' : 'Featured Brands'}
              </h2>
              {/* <div className="h-1 w-24 bg-gradient-to-r from-[#d9a82e] to-[#f4c430] mx-auto rounded-full"></div> */}
            </div>
          </div>
        </div>
        <div className="relative mx-3 md:mx-8">
          {/* Left Arrow */}
          {/* <button
            onClick={handlePrevClick}
            className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-[#d9a82e] to-[#f4c430] hover:from-[#f4c430] hover:to-[#d9a82e] text-white shadow-xl rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            aria-label="Previous items"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button> */}

          {/* Right Arrow */}
          {/* <button
            onClick={handleNextClick}
            className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-[#d9a82e] to-[#f4c430] hover:from-[#f4c430] hover:to-[#d9a82e] text-white shadow-xl rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            aria-label="Next items"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button> */}

          <div
            className="flex overflow-x-scroll space-x-3 md:space-x-4 hide-scrollbar px-1 py-3"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="flex-shrink-0 w-[calc(45%-8px)] md:w-[145px]"
              >
                <button
                  onClick={() => {
                    if (filteredCategories.length > 0) {
                      onCategoryClick && onCategoryClick(item);
                    } else {
                      onBrandClick && onBrandClick(item.name);
                    }
                  }}
                  className=" group"
                >
                  <div className="relative bg-white rounded-2xl shadow-[0_4px_12px_rgba(226,237,244,0.8)]  transition-all duration-300 p-3 md:p-4 h-[140px] flex flex-col overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#d9a82e]/10 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>
                    
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#d9a82e]/5 to-[#f4c430]/5 group-hover:from-[#d9a82e]/10 group-hover:to-[#f4c430]/10 p-3 flex items-center justify-center transition-all duration-300">
                        <img
                          src={getFullImageUrl(item.logo || item.image) || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="text-center flex-grow flex items-center justify-center">
                      {/* <h3 className="text-xs md:text-sm font-semibold text-[#d9a82e] group-hover:text-[#d9a82e] transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h3> */}
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d9a82e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
