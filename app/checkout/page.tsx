import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Review Item And Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start border-b pb-6 mb-6">
                <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden mr-4">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Airpods Max"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Airpods Max</h3>
                  <p className="text-sm text-gray-500">Color: Red</p>
                  <div className="flex items-center mt-2">
                    <span className="font-bold">$439.00</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$549.00</span>
                  </div>
                </div>
              </div>

              <h3 className="font-medium mb-4">Delivery Information</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Zip Code</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$549.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount (20%)</span>
                  <span className="font-medium text-green-600">-$109.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-xl">$439.20</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Payment Details</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="border rounded-md p-2 flex items-center justify-center">
                    <Image src="/placeholder.svg?height=30&width=40" alt="Visa" width={40} height={30} />
                  </div>
                  <div className="border rounded-md p-2 flex items-center justify-center">
                    <Image src="/placeholder.svg?height=30&width=40" alt="Mastercard" width={40} height={30} />
                  </div>
                  <div className="border rounded-md p-2 flex items-center justify-center">
                    <Image src="/placeholder.svg?height=30&width=40" alt="PayPal" width={40} height={30} />
                  </div>
                  <div className="border rounded-md p-2 flex items-center justify-center">
                    <Image src="/placeholder.svg?height=30&width=40" alt="Apple Pay" width={40} height={30} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-green-950 hover:bg-green-900 text-white">Confirm Order</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
