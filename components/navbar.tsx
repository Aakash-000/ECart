"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingCart, ChevronDown, Phone, User, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/router"

export default function Navbar() {
  const { state } = useCart()
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter()
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (searchOpen) setSearchOpen(false)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }

  return (
      <>
        <div className="w-full bg-indigo-900 text-white py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span className="text-sm hidden sm:inline">+1(123)456-7890</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center">
                <span className="text-sm">Get 50% Off on Selected Items</span>
                <Button variant="link" className="text-white text-sm p-0 ml-2">
                  Shop Now
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Eng</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center z-20">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-indigo-600">Shopcart</span>
            </Link>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <button onClick={toggleSearch} className="p-2">
                <Search size={20} className="text-gray-500" />
              </button>
              <Link href="/cart" className="relative p-2">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
                )}
              </Link>
              <button onClick={toggleMobileMenu} className="p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Search Product"
                    className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link href="/account" className="flex items-center text-sm group">
                    <User size={20} className="mr-2 group-hover:text-indigo-600 transition-colors" />
                    <span className="group-hover:text-indigo-600 transition-colors">Account</span>
                  </Link>
                  <button className="flex items-center text-sm group" onClick={logout}>
                  <span
                      className="group-hover:text-indigo-600 transition-colors"
                      onClick={() => { logout(); router.push('/login'); }} // Add redirect here
                    >Logout</span>                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center text-sm group">
                    <User size={20} className="mr-2 group-hover:text-indigo-600 transition-colors" />
                    <span className="group-hover:text-indigo-600 transition-colors">Login</span>
                  </Link>
                  <Link href="/signup" className="flex items-center text-sm group">
                    <User size={20} className="mr-2 group-hover:text-indigo-600 transition-colors" />
                    <span className="group-hover:text-indigo-600 transition-colors">Sign Up</span>
                  </Link>
                </>
              )}

              <Link href="/wishlist" className="flex items-center text-sm group">
                <Heart size={20} className="mr-2 group-hover:text-indigo-600 transition-colors" />
                <span className="group-hover:text-indigo-600 transition-colors">Wishlist</span>
              </Link>
              <Link href="/cart" className="flex items-center relative group">
                <ShoppingCart size={20} className="group-hover:text-indigo-600 transition-colors" />
                <span className="ml-2 group-hover:text-indigo-600 transition-colors">Cart</span>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (conditionally rendered) */}
          {searchOpen && (
              <div className="md:hidden mt-4 pb-2">
                <div className="relative">
                  <input
                      type="text"
                      placeholder="Search Product"
                      className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
          )}

          {/* Desktop Categories Menu */}
          <div className="hidden md:flex justify-between items-center mt-4 overflow-x-auto whitespace-nowrap pb-2">
            <div className="flex space-x-6">
              <Link
                  href="/categories"
                  className="text-sm font-medium flex items-center hover:text-indigo-600 transition-colors"
              >
                Categories <ChevronDown size={16} className="ml-1" />
              </Link>
              <Link href="/deals" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                Deals
              </Link>
              <Link href="/whats-new" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                What&apos;s New
              </Link>
              <Link href="/delivery" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                Delivery
              </Link>
            </div>
          </div>

          {/* Mobile Menu (conditionally rendered) */}
          {mobileMenuOpen && (
              <div className="md:hidden fixed inset-0 z-10 bg-white pt-20 px-4">
                <div className="flex flex-col space-y-4">
                  <Link
                      href="/categories"
                      className="flex justify-between items-center py-3 border-b"
                      onClick={toggleMobileMenu}
                  >
                    <span className="font-medium">Categories</span>
                    <ChevronDown size={16} />
                  </Link>
                  <Link href="/deals" className="py-3 border-b" onClick={toggleMobileMenu}>
                    Deals
                  </Link>
                  <Link href="/whats-new" className="py-3 border-b" onClick={toggleMobileMenu}>
                    What&apos;s New
                  </Link>
                  <Link href="/delivery" className="py-3 border-b" onClick={toggleMobileMenu}>
                    Delivery
                  </Link>{isAuthenticated ? ( // Conditionally render Logout or Login/Sign Up
                    <button
                      className="py-3 border-b text-left w-full"
                      onClick={() => {
                        logout()
                        toggleMobileMenu()
                        router.push('/login') 
                      }}
                    >
                      <span className="font-medium">Logout</span>
                    </button>
                  ) : (
                    <> {/* Render Login and Sign Up when not logged in */}
                      <Link href="/login" className="py-3 border-b" onClick={toggleMobileMenu}>Login</Link>
                      <Link href="/signup" className="py-3 border-b" onClick={toggleMobileMenu}>Sign Up</Link>
                    </>
                  )}
                  <Link href="/wishlist" className="py-3 border-b" onClick={toggleMobileMenu}>
                    Wishlist
                  </Link>
                </div>
              </div>
          )}
        </div>
      </>
  )
}
