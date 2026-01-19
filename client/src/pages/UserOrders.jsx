"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { CheckCircle, Clock, Package, Truck, AlertTriangle } from "lucide-react"
import { getFullImageUrl } from "../utils/imageUtils"

import config from "../config/config"
const UserOrders = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Check for success message from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const success = params.get("success")
    const orderId = params.get("orderId")

    if (success === "true" && orderId) {
      setSuccessMessage(`Order #${orderId.slice(-6)} has been placed successfully!`)

      // Initialize Google Customer Reviews opt-in module
      initializeGCROptIn(orderId)

      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location])

  // Initialize Google Customer Reviews opt-in module
  const initializeGCROptIn = async (orderId) => {
    try {
      // Fetch order details
      const token = localStorage.getItem("token")
      const { data: order } = await axios.get(`${config.API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Load Google API platform script if not already loaded
      if (!window.gapi) {
        const script = document.createElement("script")
        script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn"
        script.async = true
        script.defer = true
        document.body.appendChild(script)
      }

      // Calculate estimated delivery date
      const estimatedDeliveryDate = order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toISOString().split('T')[0]
        : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Extract GTINs from order items if available
      const products = order.orderItems
        .filter(item => item.product?.gtin || item.product?.barcode)
        .map(item => ({ gtin: item.product?.gtin || item.product?.barcode }))

      // Define the render function for GCR opt-in
      window.renderOptIn = function () {
        if (window.gapi && window.gapi.load) {
          window.gapi.load('surveyoptin', function () {
            window.gapi.surveyoptin.render({
              "merchant_id": 5615926184,
              "order_id": order._id,
              "email": order.shippingAddress?.email || user?.email || "",
              "delivery_country": "AE",
              "estimated_delivery_date": estimatedDeliveryDate,
              "products": products.length > 0 ? products : undefined,
              "opt_in_style": "BOTTOM_RIGHT_DIALOG"
            })
          })
        }
      }

      // Call renderOptIn if gapi is already loaded
      if (window.gapi && window.gapi.load) {
        window.renderOptIn()
      }
    } catch (error) {
      console.error("Error initializing GCR opt-in:", error)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Please log in to view your orders")
          setLoading(false)
          return
        }

        const { data } = await axios.get(`${config.API_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setOrders(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError(error.response?.data?.message || "Failed to load your orders. Please try again later.")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, navigate])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Shipped":
        return <Package className="h-5 w-5 text-blue-500" />
      case "Out for Delivery":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #e2edf4',
            borderTop: '4px solid #2377c1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {successMessage && (
          <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md flex items-center animate-fadeIn">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 font-medium">{successMessage}</div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Start shopping and discover amazing products!</p>
            <Link to="/" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <Package className="h-5 w-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-6)}</h2>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">ID</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-semibold">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded mr-2"></div>
                    Order Items
                  </h3>
                  <ul className="divide-y divide-gray-100">
                    {order.orderItems.filter(item => !item.isProtection).map((item) => (
                      <li key={item._id} className="py-5 flex hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors duration-200">
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                          <img
                            src={getFullImageUrl(item.image) || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-5 flex-1">
                          <div className="flex justify-between items-start gap-3">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                            <p className="text-base font-bold text-blue-600 whitespace-nowrap">AED {item.price.toLocaleString()}</p>
                          </div>
                          {item.selectedColorData && (
                            <p className="text-xs font-semibold mt-2 flex items-center px-2 py-1 bg-purple-50 rounded-md inline-flex w-fit">
                              <span className="inline-block w-4 h-4 rounded-full mr-2 border-2 border-white shadow-sm" style={{backgroundColor: item.selectedColorData.color?.toLowerCase() || '#9333ea'}}></span>
                              <span className="text-purple-700">Color: {item.selectedColorData.color}</span>
                            </p>
                          )}
                          {item.selectedDosData && (
                            <p className="text-xs font-semibold mt-2 flex items-center px-2 py-1 bg-blue-50 rounded-md inline-flex w-fit">
                              <span className="inline-block w-4 h-4 rounded-full mr-2 border-2 border-white shadow-sm bg-blue-500"></span>
                              <span className="text-blue-700">OS: {item.selectedDosData.dosType}</span>
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2 font-medium">Quantity: <span className="text-gray-900">{item.quantity}</span></p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {order.orderItems.some(item => item.isProtection) && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        Buyer Protection Plans
                      </h4>
                      <ul className="divide-y divide-blue-100 bg-white rounded-lg shadow-sm">
                        {order.orderItems.filter(item => item.isProtection).map((item) => (
                          <li key={item._id} className="py-4 px-4 flex items-center hover:bg-blue-50/50 transition-colors duration-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1 ml-3">
                              <h5 className="text-sm font-semibold text-gray-900">{item.name}</h5>
                            </div>
                            <p className="text-sm font-bold text-blue-600 ml-3">AED {item.price.toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50/20 border-t border-gray-200">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-gray-900">Order Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AED {order.totalPrice.toLocaleString()}</span>
                  </div>
                  {order.trackingId && (
                    <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Tracking ID:</span>
                        <span className="text-blue-600 font-mono font-medium">{order.trackingId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders
