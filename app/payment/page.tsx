"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Elements } from "@stripe/react-stripe-js"
import StripeCheckoutForm from "@/components/stripe-checkout-form"
import { Check, ChevronLeft, AlertCircle } from "lucide-react"
import { getStripe } from "@/lib/stripe-client"
import { useCart } from "@/context/cart-context"
import PayPalButton from "@/components/payment-methods/paypal-button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useBillingStore from "@/store/billingStore"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean
    message: string
    transactionId?: string
  } | null>(null)
  const stripePromise = getStripe()
  const { state } = useCart()
  const { items, subtotal, discount, shipping, tax, total } = state

  // Access billing store actions
  const { setBillingDetails } = useBillingStore();

  // Convert total to cents for Stripe
  const amountInCents = Math.round(total * 100)

  const handlePaymentSuccess = (transactionId: string) => {
    setPaymentStatus({
      success: true,
      message: "Payment successful! Redirecting to confirmation page...",
      transactionId,
    })

    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push("/payment-success")
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentStatus({
      success: false,
      message: error,
    })

    // Scroll to the top to show the error message
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link href="/cart" className="flex items-center text-indigo-600 mb-6">
        <ChevronLeft size={16} className="mr-1" />
        Back to Cart
      </Link>

      {paymentStatus && (
        <Alert
          className={`mb-6 ${
            paymentStatus.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {paymentStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{paymentStatus.success ? "Payment Successful" : "Payment Failed"}</AlertTitle>
          <AlertDescription>
            {paymentStatus.message}
            {paymentStatus.transactionId && (
              <div className="mt-1 text-sm">Transaction ID: {paymentStatus.transactionId}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods - Left Column */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-2 mb-6 bg-indigo-50">
                  <TabsTrigger
                    value="card"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger
                    value="paypal"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    PayPal
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card">
                  {stripePromise && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        appearance: { theme: "stripe" },
                        currency: "usd",
                      }}
                    >
                      <StripeCheckoutForm
                        amount={amountInCents} // Still pass amount as it's not billing detail
                      />

                    </Elements>
                  )}
                </TabsContent>
                <TabsContent value="paypal">
                  <PayPalButton amount={total} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setBillingDetails({ firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setBillingDetails({ lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setBillingDetails({ address1: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setBillingDetails({ address2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setBillingDetails({ city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      // Add ref for State if needed
                      onChange={(e) => setBillingDetails({ state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Zip Code</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      // Add ref for Zip Code if needed
                      onChange={(e) => setBillingDetails({ zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="sameAsShipping" className="mr-2" />
                  <label htmlFor="sameAsShipping" className="text-sm text-gray-600">
                    Same as shipping address
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary - Right Column */}
        <div>
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="p-4 border-b">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start mb-4 last:mb-0">
                    <div className="relative w-16 h-16 bg-indigo-50 rounded-lg overflow-hidden mr-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 space-y-3">
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
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-indigo-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 bg-white">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Check size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Checkout</h3>
                    <p className="text-xs text-gray-500">Your data is protected</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Check size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-xs text-gray-500">On all orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Check size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">30-Day Returns</h3>
                    <p className="text-xs text-gray-500">Satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
