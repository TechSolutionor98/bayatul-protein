import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import axios from "axios"
import config from "../config/config"
import { getImageUrl } from "../utils/imageUtils"
import { useWishlist } from "../context/WishlistContext"

// Status badge color helper (consistent with BigSaleSection)
const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase()
  if (statusLower.includes("available")) return "bg-green-600"
  if (statusLower.includes("out of stock") || statusLower.includes("outofstock")) return "bg-red-600"
  if (statusLower.includes("pre-order") || statusLower.includes("preorder")) return "bg-blue-600"
  if (statusLower.includes("limited") || statusLower.includes("low stock")) return "bg-yellow-500"
  return "bg-gray-600"
}

// Price helpers
const formatAEDValue = (value) => `AED ${Number(value || 0).toFixed(2)}`

// Render price with mobile-only hidden .00
const PriceText = ({ value }) => {
  const num = Number(value || 0)
  const fixed = num.toFixed(2)
  const [intPart, decPart] = fixed.split(".")
  const showDecimalOnMobile = decPart !== "00"
  return (
    <>
      AED {intPart}
      <span className={showDecimalOnMobile ? "" : "hidden md:inline"}>.{decPart}</span>
    </>
  )
}

const getPriceInfo = (p) => {
  const price = Number(p?.price) || 0
  const offer = Number(p?.offerPrice) || 0
  const hasDiscount = offer > 0 && offer < price
  const current = hasDiscount ? offer : price
  const old = hasDiscount ? price : 0
  return { current, old, hasDiscount }
}

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const href = product?.slug || product?._id ? `/product/${product.slug || product._id}` : "#"

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  // Prices
  const { current, old, hasDiscount } = getPriceInfo(product)

  // Rating data
  const rating = Number(product?.averageRating ?? product?.rating ?? 0) || 0
  const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0) || 0

  // Badge data
  const discount = product.discount && Number(product.discount) > 0 ? `${product.discount}% Off` : null
  const stockStatus = product.stockStatus || (product.countInStock > 0 ? "Available" : "Out of Stock")

  const Star = ({ filled }) => (
    <svg
      viewBox="0 0 20 20"
      className={`w-3.5 h-3.5 ${filled ? "fill-yellow-400" : "fill-gray-300"}`}
      aria-hidden="true"
    >
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  )

  return (
    <article className="group text-left md:text-center">
      <Link to={href} className="block">
        <div className="relative flex items-center justify-center bg-white">
          <div className="aspect-[4/3] w-full max-w-[260px] mx-auto flex items-center justify-center">
            <img
              src={
                getImageUrl(product) ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"
              }
              alt={product?.name || "Product"}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"
              }}
            />
          </div>

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

          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-all z-10"
            aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={`transition-colors ${
                isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Reviews row above product name */}
      <div className="mt-2 px-4 md:px-10 flex items-center justify-start md:justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < Math.round(rating)} />
        ))}
        <span className="ml-1 text-xs text-gray-600">({reviewCount})</span>
      </div>

      <div className="mt-2 text-[13px] md:px-10 md:text-sm font-semibold text-black leading-snug line-clamp-2 min-h-[40px] text-left md:text-center">
        {product?.name || "Product"}
      </div>

      {/* Price row: current + crossed old price if discounted */}
      <div className="mt-1 text-[13px] flex items-center justify-start md:justify-center gap-2">
        <span className="text-red-600 font-semibold whitespace-nowrap"><PriceText value={current} /></span>
        {hasDiscount && (
          <span className="text-gray-500 line-through whitespace-nowrap"><PriceText value={old} /></span>
        )}
      </div>

      <div className="mt-4 flex justify-start md:justify-center">
        <Link
          to={href}
          className="inline-flex items-center justify-center rounded-full bg-[#e2edf4] text-black px-6 py-2 md:px-7 md:py-2.5 text-sm font-semibold shadow-sm hover:brightness-95 transition"
        >
          Choose options
        </Link>
      </div>
    </article>
  )
}

function RandomProducts() {
  const [allProducts, setAllProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showingAll, setShowingAll] = useState(false)
  const initialCount = 12

  useEffect(() => {
    fetchRandomProducts()
  }, [])

  const fetchRandomProducts = async () => {
    try {
      setLoading(true)
      // Fetch all active, shop-visible products (server already filters isActive & hideFromShop)
      const productsRes = await axios.get(`${config.API_URL}/api/products`)
      const allProducts = Array.isArray(productsRes.data) ? productsRes.data : []

      // Prefer products that have a parentCategory (parent-level association)
      const withParent = allProducts.filter(p => {
        const pc = p?.parentCategory
        return pc && (typeof pc === 'string' || (typeof pc === 'object' && pc._id))
      })

      const parentGroups = new Map()
      withParent.forEach(p => {
        const parentId = typeof p.parentCategory === 'string' ? p.parentCategory : p.parentCategory._id
        if (!parentId) return
        if (!parentGroups.has(parentId)) parentGroups.set(parentId, [])
        parentGroups.get(parentId).push(p)
      })

      const selected = []
      const seen = new Set()

      // For each parent category group, take up to 3 random products
      parentGroups.forEach(list => {
        if (!list?.length) return
        const shuffled = [...list].sort(() => Math.random() - 0.5)
        const take = Math.min(3, shuffled.length)
        for (let i = 0; i < take; i++) {
          const prod = shuffled[i]
          if (prod && !seen.has(prod._id)) {
            selected.push(prod)
            seen.add(prod._id)
          }
        }
      })

      // Fallback: if no parent-linked products, just pick random from all products
      let finalProducts = selected
      if (finalProducts.length === 0) {
        const shuffled = [...allProducts].sort(() => Math.random() - 0.5)
        finalProducts = shuffled.slice(0, Math.min(24, shuffled.length))
      }

      // Final shuffle for variety
      finalProducts = finalProducts.sort(() => Math.random() - 0.5)

      setAllProducts(finalProducts)
      setDisplayedProducts(finalProducts.slice(0, initialCount))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching random products:", error)
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    setDisplayedProducts(allProducts)
    setShowingAll(true)
  }

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        </div>
      </section>
    )
  }

  if (displayedProducts.length === 0 && !loading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Featured Products
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              No products available at the moment
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Most Selling Products 
          </h2>
          
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {!showingAll && allProducts.length > initialCount && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] text-black px-8 py-3 text-base font-semibold shadow-lg hover:brightness-95 transition"
            >
              Load More Products ({allProducts.length - displayedProducts.length} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default RandomProducts