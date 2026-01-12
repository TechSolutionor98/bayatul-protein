import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, RefreshCw, Cookie, Shield, FileCheck, Ticket, Truck, Package } from 'lucide-react'

function LegalSection() {
  const legalItems = [
    {
      title: 'Refund & Return',
      icon: RefreshCw,
      path: '/refund-return',
      description: 'Learn about our return and refund policies'
    },
    {
      title: 'Cookies Policy',
      icon: Cookie,
      path: '/cookies-policy',
      description: 'How we use cookies on our website'
    },
    {
      title: 'Terms & Conditions',
      icon: FileText,
      path: '/terms-conditions',
      description: 'Read our terms of service'
    },
    {
      title: 'Privacy Policy',
      icon: Shield,
      path: '/privacy-policy',
      description: 'How we protect your data'
    },
    {
      title: 'Disclaimer Policy',
      icon: FileCheck,
      path: '/disclaimer-policy',
      description: 'Important legal disclaimers'
    },
    {
      title: 'Voucher Terms',
      icon: Ticket,
      path: '/voucher-terms',
      description: 'Terms for using vouchers'
    },
    {
      title: 'Delivery Terms',
      icon: Truck,
      path: '/delivery-terms',
      description: 'Shipping and delivery information'
    },
    {
      title: 'Track Order',
      icon: Package,
      path: '/track-order',
      description: 'Track your order status'
    }
  ]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Legal & Policies
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about our policies, terms, and legal information
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {legalItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                to={item.path}
                className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#e2edf4] transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#e2edf4] rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LegalSection