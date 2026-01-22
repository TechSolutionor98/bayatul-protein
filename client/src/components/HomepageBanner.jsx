"use client"

import { Link } from "react-router-dom"
import { getFullImageUrl } from "../utils/imageUtils"

/**
 * HomepageBanner Component
 * 
 * Displays dynamic banners on the homepage in different sections.
 * Supports desktop and mobile specific images.
 * Handles both internal and external links.
 * 
 * @param {Array} banners - Array of banner objects filtered by position and deviceType
 * @param {String} className - Optional additional CSS classes
 */
const HomepageBanner = ({ banners, className = "" }) => {
  if (!banners || banners.length === 0) {
    return null
  }

  // For now, display the first banner (can be extended to slider if multiple)
  const banner = banners[0]

  // Helper function to render banner content
  const renderBannerContent = () => {
    const content = (
      <img
        src={getFullImageUrl(banner.image) || "/placeholder.svg"}
        alt={banner.title || "Banner"}
        className={`w-full h-[120px] md:h-[280px] bg-cover rounded-lg hover:opacity-95 transition-opacity ${className}`}
      />
    )

    // Check if banner has a valid link
    const hasValidLink = banner.buttonLink && banner.buttonLink.trim() !== ""

    if (hasValidLink) {
      const link = banner.buttonLink.trim()
      // Check if it's an external link
      const isExternal = link.startsWith("http://") || link.startsWith("https://")
      
      if (isExternal) {
        return (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block cursor-pointer"
          >
            {content}
          </a>
        )
      } else {
        return (
          <Link 
            to={link} 
            className="block cursor-pointer"
          >
            {content}
          </Link>
        )
      }
    }

    // No link, just render the image
    return <div>{content}</div>
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {renderBannerContent()}
    </div>
  )
}

export default HomepageBanner
