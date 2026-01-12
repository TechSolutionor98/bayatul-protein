"use client"

import { Link } from "react-router-dom"
import { Facebook, Instagram, Plus, Minus, Linkedin, RotateCcw, Cookie, FileText, Shield, AlertCircle, Ticket, Truck, MapPin, Phone, Building2, BookOpen, ShoppingBag, LogIn, UserPlus, Heart, ShoppingCart } from "lucide-react"
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
      
            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Section - Grid Layout for Company, My Account, and Follow Us */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* First Row: Company (6 cols) and My Account (6 cols) */}
                <div className="md:col-span-6 flex flex-col gap-3">
                  <h3 className="text-white text-lg font-bold mb-2 pb-2 border-b-2 border-[#d9a82e]">Company</h3>
                  <Link to="/contact" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Contact Us</span>
                  </Link>
                  <Link to="/about" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">About Us</span>
                  </Link>
                  <a href="https://blog.grabatoz.ae/" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Blog</span>
                  </a>
                  <Link to="/shop" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Shop</span>
                  </Link>
                </div>

                <div className="md:col-span-6 flex flex-col gap-3">
                  <h3 className="text-white text-lg font-bold mb-2 pb-2 border-b-2 border-[#d9a82e]">My Account</h3>
                  <Link to="/login" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Register</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Wishlist</span>
                  </Link>
                  <Link to="/cart" className="flex items-center gap-2 text-white hover:text-white transition-all duration-500 ease-in-out text-sm group hover:scale-105">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all duration-500 ease-in-out flex-shrink-0">
                      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    </div>
                    <span className="text-base border-b border-transparent group-hover:border-white transition-all duration-400 ease-in-out">Cart</span>
                  </Link>
                </div>

                {/* Second Row: Follow Us (12 cols - full width) */}
                <div className="md:col-span-12">
                  <h3 className="text-white text-lg font-bold mb-4 pb-2 ">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://www.facebook.com/grabatozae/" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://x.com/GrabAtoz" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="X (Twitter)">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" role="img">
                        <path d="M18.25 2h3.5l-7.66 8.73L24 22h-6.87l-5.02-6.58L6.3 22H2.8l8.2-9.34L0 2h7.04l4.54 6.02L18.25 2z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/grabatoz/" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/company/grabatozae" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://www.pinterest.com/grabatoz/" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <FontAwesomeIcon icon={faPinterest} className="w-5 h-5" />
                    </a>
                    <a href="https://www.tiktok.com/@grabatoz" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
                    </a>
                    <a href="https://www.youtube.com/@grabAtoZ" target="_blank" className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
                      <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Section - Newsletter & App Download */}
              <div className="flex flex-col">
                 <div className="flex items-center justify-center mb-8 pb-6 border-b-2 border-white/30">
              <div className="flex-shrink-0">
                <img src="/white (2).png" alt="Baytal-Protein Logo" className="w-40 lg:w-48 filter drop-shadow-lg justify-center" />
              </div>
              
            </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Stay in the loop with our weekly newsletter</h3>
                
                {/* Newsletter Form */}
                <form onSubmit={handleNewsletterSubmit} className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3.5 text-sm bg-white/90 placeholder-gray-500 rounded-lg border-2 border-transparent text-[#2377c1] focus:outline-none focus:border-[#d9a82e] focus:ring-2 focus:ring-[#d9a82e]/50 transition-all duration-300"
                      value={newsletterEmail}
                      onChange={handleNewsletterInput}
                      required
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d9a82e] hover:bg-[#d9a82e]/90 text-white rounded-md px-5 py-2 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      →
                    </button>
                  </div>
                </form>

                {/* App Download Buttons */}
                <div className="flex gap-3 justify-center mb-4">
                  <img 
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                    alt="Download on App Store" 
                    className="h-11 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="Get it on Google Play" 
                    className="h-11 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>

                {showNewsletterModal && (
                  <NewsletterModal
                    email={newsletterEmail}
                    onClose={() => setShowNewsletterModal(false)}
                  />
                )}
                

                 <div className="flex-1 mt-5 flex justify-center">
                <img src="/1.svg" alt="Payment Methods" className="h-8 lg:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" />
              </div>

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
              {/* <div className="flex-1 flex justify-center">
                <img src="/1.svg" alt="Payment Methods" className="h-8 lg:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" />
              </div> */}

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
        {/* Legal Section */}
        <div className="border-b border-white/30">
          <button
            onClick={() => toggleSection("legal")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-base font-bold text-white">Support</span>
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