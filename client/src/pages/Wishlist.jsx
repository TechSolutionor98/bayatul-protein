import { useWishlist } from "../context/WishlistContext"
import { Link } from "react-router-dom"
import { Trash2, Heart } from "lucide-react"
import { getImageUrl } from "../utils/imageUtils"

// Status badge color helper
const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase()
  if (statusLower.includes("available")) return "bg-green-600"
  if (statusLower.includes("out of stock") || statusLower.includes("outofstock")) return "bg-red-600"
  if (statusLower.includes("pre-order") || statusLower.includes("preorder")) return "bg-blue-600"
  if (statusLower.includes("limited") || statusLower.includes("low stock")) return "bg-yellow-500"
  return "bg-gray-600"
}

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

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist()

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div
        style={{
          width: 64,
          height: 64,
          border: '5px solid #e2edf4',
          borderTop: '5px solid #2377c1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500" size={28} />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        {Array.isArray(wishlist) && wishlist.length > 0 && (
          <span className="bg-[#2377c1] text-white text-sm font-medium px-3 py-1 rounded-full">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {Array.isArray(wishlist) && wishlist.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-gray-200">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding items you love to your wishlist</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6">
          {(Array.isArray(wishlist) ? wishlist : []).map(product => {
            const href = product?.slug || product?._id ? `/product/${product.slug || product._id}` : "#"
            const { current, old, hasDiscount } = getPriceInfo(product)
            const rating = Number(product?.averageRating ?? product?.rating ?? 0) || 0
            const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0) || 0
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
              <article key={product._id} className="group text-left md:text-center">
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

                    {/* Delete/Remove Icon */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromWishlist(product._id)
                      }}
                      className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition-all z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 transition-colors"
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
          })}
        </div>
      )}
    </div>
  )
}

export default Wishlist
