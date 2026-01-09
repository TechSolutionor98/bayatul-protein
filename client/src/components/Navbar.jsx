"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { Search, Heart, User, ShoppingCart, Menu, X, Home, Grid3X3, UserCircle, HelpCircle, Package, Truck, ChevronDown, ChevronRight } from "lucide-react"
import axios from "axios"
import config from "../config/config"
import { generateShopURL } from "../utils/urlUtils"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [desktopCascadeIds, setDesktopCascadeIds] = useState([])
  const [expandedMobileCategories, setExpandedMobileCategories] = useState(new Set())

  const profileRef = useRef(null)
  const profileButtonRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const allCategoriesRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false)
      }
      if (
        allCategoriesRef.current &&
        !allCategoriesRef.current.contains(e.target)
      ) {
        setIsAllCategoriesOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/categories/tree`)
        setCategories(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  if (location.pathname.startsWith("/admin")) return null

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsProfileOpen(false)
  }

  const handleMobileSearchOpen = () => setIsMobileSearchOpen(true)
  const handleMobileSearchClose = () => setIsMobileSearchOpen(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setExpandedMobileCategories(new Set())
  }

  const toggleMobileCategory = (categoryId) => {
    setExpandedMobileCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleSearchGo = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    setIsMobileSearchOpen(false)
  }

  const getSubCategoriesForCategory = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId)
    if (!cat || !Array.isArray(cat.children)) return []
    return cat.children.filter((n) => !n.level || n.level === 1)
  }

  const getChildSubCategories = (parentNodeId) => {
    const stack = []
    for (const c of categories) {
      if (Array.isArray(c.children)) stack.push(...c.children)
    }
    const visited = new Set()
    while (stack.length) {
      const node = stack.pop()
      if (!node || visited.has(node._id)) continue
      visited.add(node._id)
      if (node._id === parentNodeId) {
        return Array.isArray(node.children) ? node.children : []
      }
      if (Array.isArray(node.children) && node.children.length) {
        stack.push(...node.children)
      }
    }
    return []
  }

  return (
    <>
      {/* Desktop announcement bar + top navbar */}
      <div className="hidden md:block sticky top-0 z-50">
        <div className="bg-[#2377c1] text-white text-xs tracking-wide border-b border-[#c0af9b]">
          <div className="max-w-[1600px] mx-auto px-8 overflow-hidden relative">
            <div style={{ whiteSpace: "nowrap", animation: "marquee 18s linear infinite" }} className="py-2 inline-block">
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-12">• Enjoy Free Shipping on Orders Over 500 AED!</span>
            </div>
          </div>
        </div>
        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

        <header className="bg-white h-[95px] border-b border-[#c0af9b]/40">
          <div className="w-full px-4 lg:px-8">
            <div className="grid grid-cols-12 gap-2 xl:gap-4 items-center h-20 max-w-[1600px] mx-auto">
              <nav className="col-span-4 flex items-center gap-3 xl:gap-6 2xl:gap-8 text-gray-800 text-[11px] xl:text-xs 2xl:text-sm uppercase tracking-wide font-medium whitespace-nowrap">
                <div className="relative" ref={allCategoriesRef}>
                  <button 
                    onClick={() => {
                      setIsAllCategoriesOpen(!isAllCategoriesOpen)
                      if (!isAllCategoriesOpen) setDesktopCascadeIds([])
                    }}
                    className="hover:text-[#d9a82e] flex items-center gap-1"
                  >
                    All CATEGORY
                    <ChevronDown size={16} className={`transition-transform ${isAllCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isAllCategoriesOpen && (
                    <div 
                      className="absolute left-0 top-full mt-7 bg-white shadow-2xl rounded-lg z-[70] border border-gray-200 overflow-hidden max-w-[calc(100vw-32px)] normal-case"
                      onMouseLeave={() => setDesktopCascadeIds([])}
                    >
                      <div className="flex max-h-[calc(100vh-160px)] overflow-x-auto">
                        <div className="flex min-w-max">
                          {/* Column 0: Parent Categories */}
                          <div className="w-64 border-r border-gray-100 overflow-y-auto">
                            <div className="p-2">
                              {categories.map((parentCategory) => {
                                const level1 = getSubCategoriesForCategory(parentCategory._id)
                                const hasChildren = level1.length > 0
                                const isActive = desktopCascadeIds[0] === parentCategory._id
                                return (
                                  <Link
                                    key={parentCategory._id}
                                    to={generateShopURL({ parentCategory: parentCategory.name })}
                                    onMouseEnter={() => setDesktopCascadeIds([parentCategory._id])}
                                    onClick={() => setIsAllCategoriesOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold text-gray-800 hover:bg-[#E2EDF4] hover:text-[#2377c1] transition ${
                                      isActive ? "bg-gray-50" : ""
                                    }`}
                                  >
                                    <span className="flex-1 pr-2">{parentCategory.name}</span>
                                    {hasChildren && <ChevronRight size={16} className="text-[#d9a82e]" />}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>

                          {(() => {
                            const cols = []
                            const activeParentId = desktopCascadeIds[0]
                            if (!activeParentId) return null
                            const parent = categories.find((c) => c._id === activeParentId)
                            if (!parent) return null

                            const buildParams = (chain) => {
                              const params = { parentCategory: parent.name }
                              const keys = ["subcategory", "subcategory2", "subcategory3", "subcategory4"]
                              for (let i = 0; i < Math.min(chain.length, keys.length); i++) {
                                params[keys[i]] = chain[i]
                              }
                              return params
                            }

                            const getNameById = (id) => {
                              if (!id) return ""
                              const stack = [...categories]
                              const visited = new Set()
                              while (stack.length) {
                                const node = stack.pop()
                                if (!node || visited.has(node._id)) continue
                                visited.add(node._id)
                                if (node._id === id) return node.name || ""
                                if (Array.isArray(node.children) && node.children.length) {
                                  stack.push(...node.children)
                                }
                              }
                              return ""
                            }

                            const getItemsForLevel = (levelIndex) => {
                              if (levelIndex === 1) return getSubCategoriesForCategory(activeParentId)
                              const prevSelectedId = desktopCascadeIds[levelIndex - 1]
                              if (!prevSelectedId) return []
                              return getChildSubCategories(prevSelectedId)
                            }

                            for (let levelIndex = 1; levelIndex < 5; levelIndex++) {
                              const items = getItemsForLevel(levelIndex)
                              if (!Array.isArray(items) || items.length === 0) break
                              cols.push(
                                <div key={`col-${levelIndex}`} className="w-64 border-r border-gray-100 last:border-r-0 overflow-y-auto">
                                  <div className="p-2">
                                    {items.map((node) => {
                                      const hasNested = Array.isArray(node.children) && node.children.length > 0
                                      const isActive = desktopCascadeIds[levelIndex] === node._id
                                      const chainPrefix = desktopCascadeIds
                                        .slice(1, levelIndex)
                                        .map(getNameById)
                                        .filter(Boolean)
                                      const params = buildParams([...chainPrefix, node.name])
                                      return (
                                        <Link
                                          key={node._id}
                                          to={generateShopURL(params)}
                                          onMouseEnter={() => {
                                            setDesktopCascadeIds((prev) => {
                                              const next = prev.slice(0, levelIndex)
                                              next[levelIndex] = node._id
                                              return next
                                            })
                                          }}
                                          onClick={() => setIsAllCategoriesOpen(false)}
                                          className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold text-gray-800 hover:bg-[#E2EDF4] hover:text-[#2377c1] transition ${
                                            isActive ? "bg-gray-50" : ""
                                          }`}
                                        >
                                          <span className="flex-1 pr-2">{node.name}</span>
                                          {hasNested && <ChevronRight size={16} className="text-[#d9a82e]" />}
                                        </Link>
                                      )
                                    })}
                                  </div>
                                </div>,
                              )
                            }
                            return cols
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/" className="hover:text-[#d9a82e] flex-shrink-0">Home</Link>
                {/* <Link to="/shop" className="hover:text-[#d9a82e]">Catalog</Link> */}
                <Link to="/shop" className="hover:text-[#d9a82e] flex-shrink-0">Products</Link>
                <Link to="/contact" className="hover:text-[#d9a82e] flex-shrink-0">Contact Us</Link>
              </nav>

              <div className="col-span-4 flex items-center justify-center">
                <Link to="/" className="block">
                  <div className="w-44 h-28 rounded-full overflow-hidden">
                    <img src="/baytal-protien-logo.webp" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </Link>
              </div>

              <div className="col-span-4 flex items-center justify-end gap-5 text-gray-800">
                <button onClick={handleMobileSearchOpen} aria-label="Open search" className="w-10 h-10 flex items-center justify-center">
                  <Search size={22} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((s) => !s)}
                    className="w-10 h-10 flex items-center justify-center"
                    ref={profileButtonRef}
                    aria-label="Account"
                  >
                    <User size={22} />
                  </button>
                  {isProfileOpen && (
                    <div ref={profileRef} className="absolute right-0 w-48 py-2 px-2 mt-4 bg-white rounded-md shadow-xl z-20 border">
                      {isAuthenticated ? (
                        <>
                          <Link to="/profile" className="block px-4 py-2 text-sm rounded text-gray-700 hover:text-white hover:bg-[#d9a82e]" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                          <Link to="/orders" className="block px-4 py-2 text-sm rounded text-gray-700 hover:text-white hover:bg-[#d9a82e]" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                          <Link to="/track-order" className="block px-4 py-2 text-sm rounded text-gray-700 hover:text-white hover:bg-[#d9a82e]" onClick={() => setIsProfileOpen(false)}>Track Order</Link>
                          <hr className="my-1" />
                          <button onClick={handleLogout} className="block w-full text-left  px-4 py-2 text-sm text-gray-700 rounded hover:bg-[#dc2626] hover:text-white">Logout</button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#E2EDF4]" onClick={() => setIsProfileOpen(false)}>Login</Link>
                          <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#E2EDF4]" onClick={() => setIsProfileOpen(false)}>Register</Link>
                          <Link to="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#E2EDF4]" onClick={() => setIsProfileOpen(false)}>Track Order</Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center" aria-label="Cart">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-1 -right-1 bg-[#d9a82e] text-white text-[10px] leading-none rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile navbar */}
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleMobileMenu} className="p-2">
            <Menu size={24} className="text-gray-700" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/baytal-protien-logo.webp" alt="Logo" className="h-11" />
          </Link>
          <button className="p-2" onClick={handleMobileSearchOpen} aria-label="Open search">
            <Search size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(192,175,155,0.5)]">
          <div className="w-full bg-white p-4 shadow-md relative">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchGo} className="flex-1 relative">
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d9a82e]" autoFocus ref={mobileSearchInputRef} />
                  <button type="submit" className="px-4 py-2 bg-[#d9a82e] text-white rounded hover:bg-[#c99720]">
                    <Search size={18} />
                  </button>
                </div>
              </form>
              <button onClick={handleMobileSearchClose} className="ml-2 p-2" aria-label="Close search">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-[rgba(192,175,155,0.5)]" onClick={closeMobileMenu}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 bg-[#2377c1] text-white">
              <div className="flex items-center">
                <UserCircle size={24} className="text-white mr-2" />
                {isAuthenticated ? (
                  <span className="text-white">{`Hello, ${user?.name || "User"}`}</span>
                ) : (
                  <button onClick={() => { closeMobileMenu(); navigate("/login") }} className="text-white font-medium hover:text-white/90 transition-colors">
                    Hello, <span className="underline">Sign in</span>
                  </button>
                )}
              </div>
              <button onClick={closeMobileMenu} className="p-1">
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-2 mb-6">
                <Link to="/orders" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <Package size={20} className="mr-3" />
                  <strong>My Orders</strong>
                </Link>
                <Link to="/track-order" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <Truck size={20} className="mr-3" />
                  <strong>Track Order</strong>
                </Link>
                <Link to="/help" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <HelpCircle size={20} className="mr-3" />
                  <strong>Help Center</strong>
                </Link>
              </div>

              {/* Mobile Categories Section */}
              <div className="bg-[#2377c1] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Grid3X3 size={18} />
                    <span className="font-semibold">All Category</span>
                  </div>
                  <Link to="/shop" onClick={closeMobileMenu} className="text-white text-sm">See All</Link>
                </div>
              </div>

              <div className="space-y-1">
                {categories.map((parentCategory) => {
                  const renderCategory = (category, level = 0, parentChain = []) => {
                    const isExpanded = expandedMobileCategories.has(category._id)
                    let children = []
                    
                    if (level === 0) {
                      children = getSubCategoriesForCategory(category._id)
                    } else {
                      children = getChildSubCategories(category._id)
                    }
                    
                    const hasChildren = children.length > 0
                    const canExpand = level < 4 // Max 5 levels (0-4)

                    // Build URL params
                    const buildParams = () => {
                      if (level === 0) {
                        return { parentCategory: category.name }
                      }
                      const params = { parentCategory: parentChain[0] }
                      const keys = ["subcategory", "subcategory2", "subcategory3", "subcategory4"]
                      for (let i = 1; i < parentChain.length; i++) {
                        params[keys[i - 1]] = parentChain[i]
                      }
                      params[keys[parentChain.length - 1]] = category.name
                      return params
                    }

                    return (
                      <div key={category._id}>
                        <div 
                          className="flex items-center justify-between hover:bg-[#E2EDF4] rounded"
                          style={{ paddingLeft: `${level * 16 + 8}px` }}
                        >
                          <Link
                            to={generateShopURL(buildParams())}
                            onClick={closeMobileMenu}
                            className={`flex-1 py-2.5 text-sm font-semibold ${
                              level === 0 ? 'text-gray-800 hover:text-[#2377c1]' : 
                              'text-gray-800 hover:text-[#2377c1]'
                            }`}
                          >
                            {category.name}
                          </Link>
                          {hasChildren && canExpand && (
                            <button
                              onClick={() => toggleMobileCategory(category._id)}
                              className="p-2 mr-1"
                            >
                              <ChevronRight 
                                size={16} 
                                className={`text-[#d9a82e] transition-transform ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        
                        {isExpanded && hasChildren && canExpand && (
                          <div className="mt-1">
                            {children.map(child => renderCategory(child, level + 1, [...parentChain, category.name]))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return renderCategory(parentCategory, 0, [])
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-[#d9a82e]">
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-[#d9a82e]">
            <Grid3X3 size={22} />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-[#d9a82e] relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-[#d9a82e] relative">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlist.length}</span>
            )}
            <span className="text-xs mt-1">WishList</span>
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-[#d9a82e]">
            <UserCircle size={22} />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar


