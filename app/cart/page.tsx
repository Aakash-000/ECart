"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface RecommendedProduct {
  id: number
  name: string
  price: string
  image: string
}

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart()
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const { items, subtotal, discount, shipping, tax, total } = state

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Check if the current path is already /login to avoid infinite redirects
      if (window.location.pathname !== "/login") {
        router.push("/login")
      }
    }
  }, [isLoading, isAuthenticated, router])

  const recommendedProducts: RecommendedProduct[] = [
    {
      id: 1,
      name: "Wireless Earbuds, IPX8",
      price: "89.99",
      image: "/images/products/wireless-earbuds.png",
    },
    {
      id: 4,
      name: "VIVEFOX Headphones",
      price: "39.99",
      image: "/images/products/vivefox-headphones.png",
    },
    {
      id: 6,
      name: "TAGRY Bluetooth",
      price: "109.99",
      image: "/images/products/tagry-earbuds.png",
    },
    {
      id: 8,
      name: "Mpow CH6",
      price: "59.99",
      image: "/images/products/mpow-headphones.png",
    },
  ]

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: number) => {
    removeFromCart(id)
  }

  const handleClearCart = () => {
    clearCart()
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading cart...</div>
  }

  return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

        {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Browse our products and find something you'll love!
              </p>
              <Link href="/products">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Left Column */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b bg-white">
                    <div className="flex justify-between items-center">
                      <CardTitle>Cart Items ({items.length})</CardTitle>
                      <Link href="/products" className="text-sm text-indigo-600 font-medium hover:underline">
                        Continue Shopping
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-white">
                    <>
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row border-b p-6">
                          <div className="flex items-center sm:w-1/2 mb-4 sm:mb-0">
                            <div className="relative w-20 h-20 bg-indigo-50 rounded-xl overflow-hidden mr-4">
                              <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-2"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.variant}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:w-1/2">
                            <div className="flex items-center border rounded-full overflow-hidden">
                              <button
                                  className="px-3 py-1 hover:bg-indigo-50"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 py-1 border-x">{item.quantity}</span>
                              <button
                                  className="px-3 py-1 hover:bg-indigo-50"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-indigo-900">${(item.price * item.quantity).toFixed(2)}</div>
                              {item.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ${(item.originalPrice * item.quantity).toFixed(2)}
                                  </div>
                              )}
                            </div>

                            <button
                                className="text-gray-500 hover:text-red-500 ml-4"
                                onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                    ))}
                    </>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-6 bg-white">
                    <Button
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-full"
                        onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button variant="outline" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                      Update Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Order Summary - Right Column */}
              <div>
                <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b bg-white">
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="py-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 bg-white">
                    <div className="w-full">
                      <div className="flex justify-between mb-4 py-3">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-xl text-indigo-900">${total.toFixed(2)}</span>
                      </div>
                      <Link href="/payment" className="w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                          Proceed to Checkout
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>

                <Card className="mt-6 border-0 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b bg-white">
                    <CardTitle>Have a Promo Code?</CardTitle>
                  </CardHeader>
                  <CardContent className="py-6 bg-white">
                    <div className="flex">
                      <input
                          type="text"
                          placeholder="Enter promo code"
                          className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 text-white">Apply</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        )}

        {/* Recommended Products */}
        {items.length > 0 && (
            <div className="mt-16">
              <h2 className="section-title">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {recommendedProducts.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <div className="product-card rounded-2xl overflow-hidden group">
                        <div className="relative h-48 bg-indigo-50">
                          <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-contain p-4"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="font-bold text-indigo-900">${product.price}</span>
                          </div>
                          <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">Add to Cart</Button>
                        </div>
                      </div>
                    </Link>
                ))}
              </div>
            </div>
        )}
      </div>
  )
}
