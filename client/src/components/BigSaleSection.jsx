import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { getFullImageUrl } from "../utils/imageUtils"

// Status badge color helper (consistent with other sections)
const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase()
  if (statusLower.includes("available")) return "bg-green-600"
  if (statusLower.includes("out of stock") || statusLower.includes("outofstock")) return "bg-red-600"
  if (statusLower.includes("pre-order") || statusLower.includes("preorder")) return "bg-blue-600"
  if (statusLower.includes("limited") || statusLower.includes("low stock")) return "bg-yellow-500"
  return "bg-gray-600"
}

// Card UI aligned with RandomProducts but keeps wishlist/cart functionality
const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const discount = product.discount && Number(product.discount) > 0 ? `${product.discount}% Off` : null
  const stockStatus = product.stockStatus || (product.countInStock > 0 ? "Available" : "Out of Stock")
  const basePrice = Number(product.price) || 0
  const offerPrice = Number(product.offerPrice) || 0

  const hasValidOffer = offerPrice > 0 && basePrice > 0 && offerPrice < basePrice
  const showOldPrice = hasValidOffer

  let priceToShow = 0
  if (hasValidOffer) {
    priceToShow = offerPrice
  } else if (basePrice > 0) {
    priceToShow = basePrice
  } else if (offerPrice > 0) {
    priceToShow = offerPrice
  }

  const rating = Number(product.rating) || 0
  const numReviews = Number(product.numReviews) || 0
  const categoryName = product.category?.name || ""

  const href = product?.slug || product?._id ? `/product/${encodeURIComponent(product.slug || product._id)}` : "#"

  return (
    <article className="group h-full bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative px-3 pt-3">
        <Link to={href} className="block">
          <div className="relative flex items-center justify-center bg-white">
            <div className="aspect-[4/3] w-full flex items-center justify-center">
              <img
                src={getFullImageUrl(product.image) || "/placeholder.svg?height=120&width=120"}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </div>
        </Link>

        {/* Wishlist icon */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product)
          }}
          aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-gray-400"}
          />
        </button>

        {/* Status + discount badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <div
            className={`${getStatusColor(
              stockStatus,
            )} text-white px-1.5 py-0.5 rounded text-[10px] font-medium shadow-sm`}
          >
            {stockStatus.replace("Available Product", "Available")}
          </div>
          {discount && (
            <div className="bg-[#d9a82e] text-white px-1.5 py-0.5 rounded text-[10px] font-semibold shadow-sm">
              {discount}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-3 pb-3 pt-2">
        {/* Rating row above name, centered */}
        <div className="mt-1 flex items-center justify-center gap-1 min-h-[20px]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-[11px] text-gray-500 ml-0.5">({numReviews})</span>
        </div>

        <Link to={href}>
          <h3 className="mt-1 text-[13px] md:text-sm font-semibold text-black leading-snug line-clamp-2 min-h-[40px] text-center group-hover:text-[#2377c1]">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="text-red-600 font-semibold text-sm">
            {Number(priceToShow).toLocaleString(undefined, { minimumFractionDigits: 2 })}AED
          </div>
          {showOldPrice && (
            <div className="text-gray-400 line-through text-xs font-medium">
              {Number(basePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}AED
            </div>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToCart(product)
          }}
          className="mt-3 w-full inline-flex items-center justify-center rounded-full bg-[#e2edf4]  border  hover:border-transparent text-black text-xs font-medium py-2 px-2 gap-1 transition-colors duration-150"
          disabled={stockStatus === "Out of Stock"}
        >
          {/* <ShoppingBag size={12} /> */}
          Choose options
        </button>
      </div>
    </article>
  )
}

const BigSaleSection = ({ products = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!products || products.length === 0) return null

  const visibleCount = isMobile ? Math.min(2, products.length) : Math.min(5, products.length)
  const maxIndex = Math.max(products.length - visibleCount, 0)

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < maxIndex ? prev + 1 : maxIndex))
  }

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Premium Products</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-[#d9a82e] text-white hover:text-gray-700 hover:bg-lime-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide >= maxIndex}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-[#d9a82e] text-white hover:text-gray-700 hover:bg-lime-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(currentSlide * 100) / visibleCount}%)` }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0"
                  style={{ 
                    flex: `0 0 calc((100% - ${(visibleCount - 1) * 16}px) / ${visibleCount})`,
                    maxWidth: `calc((100% - ${(visibleCount - 1) * 16}px) / ${visibleCount})`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BigSaleSection
