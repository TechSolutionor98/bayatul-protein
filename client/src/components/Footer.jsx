"use client"

import { Link } from "react-router-dom"
import { Facebook, Instagram, Plus, Minus, Linkedin } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPinterest } from "@fortawesome/free-brands-svg-icons"
import { faTiktok } from "@fortawesome/free-brands-svg-icons"
import { faYoutube } from "@fortawesome/free-brands-svg-icons"
import { useState, useEffect } from "react"
import axios from "axios"
import { generateShopURL } from "../utils/urlUtils"

import config from "../config/config"
import NewsletterModal from "./NewsletterModal";

const API_BASE_URL = `${config.API_URL}`

const Footer = ({ className = "" }) => {
  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    categories: false,
    legal: false,
    support: false,
    connect: false,
  })
  const [categories, setCategories] = useState([])
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [subCategories, setSubCategories] = useState([])
  const [columnCount, setColumnCount] = useState(5)

  // Update column count based on screen width and zoom level
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth

      if (width >= 1536) {
        // 2xl screens - adjust based on viewport width (increases when zooming out)
        if (width >= 2200) {
          // 75% zoom or less
          setColumnCount(6)
        } else if (width >= 1920) {
          // 80% zoom
          setColumnCount(5)
        } else if (width >= 1700) {
          // 90% zoom
          setColumnCount(5)
        } else {
          // 100% zoom
          setColumnCount(5)
        }
      } else {
        setColumnCount(5)
      }
    }

    updateColumnCount()
    window.addEventListener("resize", updateColumnCount)
    return () => window.removeEventListener("resize", updateColumnCount)
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/categories`)
      const validCategories = data.filter((cat) => {
        const isValid =
          cat &&
          typeof cat === "object" &&
          cat.name &&
          typeof cat.name === "string" &&
          cat.name.trim() !== "" &&
          cat.isActive !== false &&
          !cat.isDeleted &&
          !cat.name.match(/^[0-9a-fA-F]{24}$/) && // Not an ID
          !cat.parentCategory // Only include parent categories
        return isValid
      })
      validCategories.sort((a, b) => a.name.localeCompare(b.name))
      setCategories(validCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/subcategories`)
      setSubCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    }
  }

  const getSubCategoriesForCategory = (categoryId) => {
    return subCategories.filter((sub) => sub.category?._id === categoryId)
  }

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleNewsletterInput = (e) => setNewsletterEmail(e.target.value);
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) setShowNewsletterModal(true);
  };

  return (
    <>
      {/* Desktop Footer - Hidden on mobile */}
      <footer className={`hidden md:block ${className}`}>
        {/* Main Footer Section with Theme Background */}
        <div className="w-full bg-[#2377c1] relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9a82e] rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e2edf4] rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-[1600px] mx-auto pt-12 pb-8 px-4 lg:px-8 relative z-10">
            {/* First Row - Logo, Newsletter, Social Icons, Download App in one horizontal line */}
            <div className="flex  flex-wrap items-start justify-between gap-8 mb-12 pb-8 border-b-2 border-white/30">
              {/* Logo */}
              {/* <div className="flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-28 lg:w-32 xl:w-36 filter drop-shadow-lg" />
              </div> */}

              {/* Newsletter Section */}
              <div className="flex-1 min-w-[280px] max-w-[400px]">
                <h4 className="text-sm lg:text-base font-bold mb-2 text-white">
                  Stay Updated
                </h4>
                {/* <p className="text-xs lg:text-sm text-[#e2edf4] mb-3">Get exclusive deals & news</p> */}

                {/* Form with Modern Design */}
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 text-xs lg:text-sm bg-white placeholder-gray-500 rounded-xl border-2 border-[#d9a82e] text-[#2377c1] focus:outline-none focus:border-[#d9a82e] focus:ring-2 focus:ring-[#d9a82e]/50 transition-all duration-300"
                      value={newsletterEmail}
                      onChange={handleNewsletterInput}
                      required
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d9a82e] hover:bg-[#d9a82e]/90 text-white rounded-lg px-4 py-2 text-xs lg:text-sm font-semibold transition-all duration-300 shadow-lg"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
                {showNewsletterModal && (
                  <NewsletterModal
                    email={newsletterEmail}
                    onClose={() => setShowNewsletterModal(false)}
                  />
                )}
              </div>
 

              <div className="flex-shrink-0 -ml-8 lg:-ml-12 mt-3">
                <img src="/white (2).png" alt="Logo" className="w-32 lg:w-36 xl:w-40 filter drop-shadow-lg" />
              </div>

              {/* Social Icons */}
              <div>
                <h4 className="text-sm lg:text-base font-bold mb-3 text-white">Follow Us</h4>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <a href="https://www.facebook.com/grabatozae/" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <Facebook className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                  <a href="https://x.com/GrabAtoz" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110" aria-label="X (Twitter)">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5 fill-current" role="img">
                      <path d="M18.25 2h3.5l-7.66 8.73L24 22h-6.87l-5.02-6.58L6.3 22H2.8l8.2-9.34L0 2h7.04l4.54 6.02L18.25 2z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/grabatoz/" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/grabatozae" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <Linkedin className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                  <a href="https://www.pinterest.com/grabatoz/" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <FontAwesomeIcon icon={faPinterest} className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                  <a href="https://www.tiktok.com/@grabatoz" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <FontAwesomeIcon icon={faTiktok} className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                  <a href="https://www.youtube.com/@grabAtoZ" target="_blank" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#e2edf4]/20 backdrop-blur-sm border border-[#e2edf4]/30 flex items-center justify-center text-[#e2edf4] hover:text-white hover:border-white hover:bg-[#e2edf4]/30 transition-all duration-300 hover:scale-110">
                    <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 lg:w-5 lg:h-5" />
                  </a>
                </div>
              </div>

              {/* App Download */}
              {/* <div>
                <h4 className="text-xs lg:text-sm font-semibold mb-3 text-[#d9a82e]">Download App</h4>
                <img src="https://res.cloudinary.com/dyfhsu5v6/image/upload/v1757938965/google_pj1cxc.webp" alt="Google Play" className="rounded-xl h-10 lg:h-12 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg" />
              </div> */}
            </div>

            {/* Second Row - 4 Columns: Top Categories, More Categories, Legal, Support */}
            <div className="grid grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
              {/* Column 1 - Top Categories */}
              <div className="col-span-1 flex flex-col">
                <div className="mb-4 pb-2 border-b-2 border-[#d9a82e]">
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-white">Top Categories</h3>
                </div>
                <ul className="space-y-2 lg:space-y-2.5 text-white text-sm lg:text-base">
                  {categories.slice(0, 6).map((category) => (
                    <li key={category._id}>
                      <Link to={generateShopURL({ parentCategory: category.name })} className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                        <span className="relative">
                          {category.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  {subCategories.slice(0, 2).map((subCategory) => (
                    <li key={`sub-${subCategory._id}`}>
                      <Link to={generateShopURL({
                        parentCategory: subCategory.category?.name || '',
                        subCategory: subCategory.name
                      })} className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                        <span className="relative">
                          {subCategory.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 - More Categories */}
              <div className="col-span-1 flex flex-col">
                <div className="mb-4 pb-2 border-b-2 border-[#d9a82e]">
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-white">More Categories</h3>
                </div>
                <ul className="space-y-2 lg:space-y-2.5 text-white text-sm lg:text-base">
                  {categories.slice(6, 10).map((category) => (
                    <li key={category._id}>
                      <Link to={generateShopURL({ parentCategory: category.name })} className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                        <span className="relative">
                          {category.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  {subCategories.slice(4, 8).map((subCategory) => (
                    <li key={`sub-${subCategory._id}`}>
                      <Link to={generateShopURL({
                        parentCategory: subCategory.category?.name || '',
                        subCategory: subCategory.name
                      })} className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                        <span className="relative">
                          {subCategory.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 - Legal */}
              <div className="col-span-1 flex flex-col">
                <div className="mb-4 pb-2 border-b-2 border-[#d9a82e]">
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-white">Legal</h3>
                </div>
                <ul className="space-y-2 lg:space-y-2.5 text-white text-sm lg:text-base">
                  <li>
                    <Link to="/refund-return" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Refund and Return
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies-policy" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Cookies Policy
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Terms & Conditions
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Privacy Policy
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/disclaimer-policy" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Disclaimer Policy
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/track-order" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Track Order
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/voucher-terms" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Voucher Terms
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/delivery-terms" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Delivery Terms
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4 - Support */}
              <div className="col-span-1 flex flex-col">
                <div className="mb-4 pb-2 border-b-2 border-[#d9a82e]">
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-white">Support</h3>
                </div>
                <ul className="space-y-2 lg:space-y-2.5 text-white text-sm lg:text-base">
                  <li>
                    <Link to="/about" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        About Us
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Contact Us
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <a href="https://blog.grabatoz.ae/" rel="noopener noreferrer" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Blog
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <Link to="/shop" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Shop
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Login
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Register
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="hover:translate-x-1 inline-block transition-all duration-300 relative group">
                      <span className="relative">
                        Wishlist
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="hover:translate-x-1 inline-block transition-all duration-300  relative group">
                      <span className="relative">
                        Cart
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d9a82e] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Footer with Modern Design */}
        <div className="bg-white border-t border-blue-600">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 lg:py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm lg:text-base text-gray-800 font-medium">
                  © 2025 <span className="text-[#d9a82e] font-bold">Baytal-Protien</span>
                </p>
              </div>

              {/* Payment Methods */}
              <div className="flex-1 flex justify-center">
                <img src="/1.svg" alt="Payment Methods" className="h-8 lg:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Developer Credit */}
              <div className="flex-1 text-center md:text-right">
                <p className="text-sm lg:text-base text-gray-800 font-medium">
                  Developed By <span className="text-[#d9a82e] font-bold hover:text-[#d9a82e] transition-colors duration-300">
                    <a href="https://techsolutionor.com" target="_blank" rel="noopener noreferrer">Tech Solutionor</a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer - Only visible on mobile */}
      <footer className="md:hidden bg-[#2377c1]">
        {/* Categories Section */}
        <div className="border-b border-white/30">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex justify-between items-center p-4 text-left group"
          >
            <span className="text-base font-bold text-white">Categories</span>
            <div className={`transform transition-transform duration-300 ${openSections.categories ? 'rotate-180' : ''}`}>
              {openSections.categories ? 
                <Minus size={20} className="text-white" /> : 
                <Plus size={20} className="text-white" />
              }
            </div>
          </button>
          {openSections.categories && (
            <div className="px-4 pb-4 animate-fadeIn">
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/shop?parentCategory=${category._id}`} className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Legal Section */}
        <div className="border-b border-white/30">
          <button
            onClick={() => toggleSection("legal")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-base font-bold text-white">Legal</span>
            <div className={`transform transition-transform duration-300 ${openSections.legal ? 'rotate-180' : ''}`}>
              {openSections.legal ? 
                <Minus size={20} className="text-white" /> : 
                <Plus size={20} className="text-white" />
              }
            </div>
          </button>
          {openSections.legal && (
            <div className="px-4 pb-4 animate-fadeIn">
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="https://blog.grabatoz.ae/" rel="noopener noreferrer" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Blog
                  </a>
                </li>
                <li>
                  <Link to="/shop" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="border-b border-white/30">
          <button
            onClick={() => toggleSection("support")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-base font-bold text-white">Support</span>
            <div className={`transform transition-transform duration-300 ${openSections.support ? 'rotate-180' : ''}`}>
              {openSections.support ? 
                <Minus size={20} className="text-white" /> : 
                <Plus size={20} className="text-white" />
              }
            </div>
          </button>
          {openSections.support && (
            <div className="px-4 pb-4 animate-fadeIn">
              <ul className="space-y-3">
                <li>
                  <Link to="/refund-return" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Refund and Return
                  </Link>
                </li>
                <li>
                  <Link to="/cookies-policy" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Cookies Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer-policy" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Disclaimer Policy
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-white hover:text-[#d9a82e] transition-colors duration-300 text-sm font-semibold flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a82e] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Connect Section */}
        <div className="border-b border-[#d9a82e]/20">
          <button
            onClick={() => toggleSection("connect")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-base font-bold text-white">Connect</span>
            <div className={`transform transition-transform duration-300 ${openSections.connect ? 'rotate-180' : ''}`}>
              {openSections.connect ? 
                <Minus size={20} className="text-white" /> : 
                <Plus size={20} className="text-white" />
              }
            </div>
          </button>
          {openSections.connect && (
            <div className="px-4 pb-4 animate-fadeIn">
              <div className="grid grid-cols-4 gap-3">
                <a
                  href="https://www.facebook.com/grabatozae/"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={20} className="text-[#e2edf4] hover:text-[#d9a82e]" />
                </a>
                <a
                  href="https://x.com/GrabAtoz"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e2edf4] fill-current" role="img">
                    <path d="M18.25 2h3.5l-7.66 8.73L24 22h-6.87l-5.02-6.58L6.3 22H2.8l8.2-9.34L0 2h7.04l4.54 6.02L18.25 2z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/grabatoz/"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={20} className="text-[#e2edf4]" />
                </a>
                <a
                  href="https://www.linkedin.com/company/grabatozae"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} className="text-[#e2edf4]" />
                </a>
                <a
                  href="https://www.pinterest.com/grabatoz/"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="Pinterest"
                >
                  <FontAwesomeIcon icon={faPinterest} style={{ width: '20px', height: '20px' }} className="text-[#e2edf4]" />
                </a>
                <a
                  href="https://www.tiktok.com/@grabatoz"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <FontAwesomeIcon icon={faTiktok} style={{ width: '20px', height: '20px' }} className="text-[#e2edf4]" />
                </a>
                <a
                  href="https://www.youtube.com/@grabAtoZ"
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#e2edf4]/10 backdrop-blur-sm border border-[#e2edf4]/20 hover:border-[#d9a82e] transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <FontAwesomeIcon icon={faYoutube} style={{ width: '20px', height: '20px' }} className="text-[#e2edf4]" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Shop On The Go Section - Always Visible with Modern Design */}
        <div className="bg-[#2377c1] text-white p-6 relative overflow-hidden border-t-2 border-white/30">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d9a82e] rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-center mb-4 text-white">Shop On The Go</h3>
            
            <div className="flex justify-center mb-6">
              <img src="/google_play.png" alt="Google Play" className="h-10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>

            {/* Payment Methods */}
            <div className="flex justify-center mb-6">
              <img src="/1.svg" alt="Payment Methods" className="h-10 w-auto opacity-80" />
            </div>

            {/* Copyright with Modern Design */}
            <div className="text-center text-sm space-y-2">
              <p className="text-white">
                © 2025 <span className="text-[#d9a82e] font-semibold">Baytal-Protien</span> | Powered by <span className="text-white">Crown Excel</span>
              </p>
              <p className="text-white">
                Developed By <span className="text-[#d9a82e] font-semibold"><a href="https://techsolutionor.com" target="_blank" rel="noopener noreferrer">Tech Solutionor</a></span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer