import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"
import config from '../config/config'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  // Load wishlist from backend or localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch from backend
      setLoading(true)
      console.log('[Wishlist] Fetching wishlist from backend...')
      axios.get(`${config.API_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then(res => {
          console.log('[Wishlist] Backend response:', res.data)
          setWishlist(res.data)
        })
        .catch((err) => {
          console.error('[Wishlist] Error fetching from backend:', err)
          setWishlist([])
        })
        .finally(() => setLoading(false))
    } else {
      // Load from localStorage
      const stored = localStorage.getItem("wishlist")
      console.log('[Wishlist] Loaded from localStorage:', stored)
      setWishlist(stored ? JSON.parse(stored) : [])
    }
  }, [isAuthenticated, user])

  // Sync guest wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[Wishlist] Syncing to localStorage:', wishlist)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isAuthenticated])

  // On mount, always load from localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem("wishlist")
      console.log('[Wishlist] On mount loaded from localStorage:', stored)
      setWishlist(stored ? JSON.parse(stored) : [])
    }
  }, [])

  // Add product to wishlist
  const addToWishlist = async (product) => {
    console.log('[Wishlist] Adding to wishlist:', product)
    
    // Optimistic update - update UI immediately
    setWishlist(prev => {
      if (prev.find(item => item._id === product._id)) return prev
      return [...prev, product]
    })
    showToast && showToast("Added to wishlist", "success")
    
    // Then sync with backend if authenticated
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token")
        const { data } = await axios.post(`${config.API_URL}/api/wishlist`, { productId: product._id }, { headers: { Authorization: `Bearer ${token}` } })
        console.log('[Wishlist] Backend add response:', data)
        setWishlist(data)
      } catch (error) {
        console.error('[Wishlist] Error adding to backend:', error)
        // Revert optimistic update on error
        setWishlist(prev => prev.filter(item => item._id !== product._id))
        showToast && showToast("Failed to add to wishlist", "error")
      }
    }
  }

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    console.log('[Wishlist] Removing from wishlist:', productId)
    
    // Optimistic update - update UI immediately
    setWishlist(prev => prev.filter(item => item._id !== productId))
    showToast && showToast("Removed from wishlist", "info")
    
    // Then sync with backend if authenticated
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token")
        const { data } = await axios.delete(`${config.API_URL}/api/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
        console.log('[Wishlist] Backend remove response:', data)
        setWishlist(data)
      } catch (error) {
        console.error('[Wishlist] Error removing from backend:', error)
        // Note: Not reverting on error as the item is already removed from UI
        // The backend will be in sync on next page load
      }
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some(item => (item._id || item) === productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}
