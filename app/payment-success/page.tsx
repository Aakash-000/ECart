import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface OrderDetails {
  orderNumber: string
  date: string
  total: string
  paymentMethod: string
}

export default function PaymentSuccessPage() {
  // Order details
  const orderDetails: OrderDetails = {
    orderNumber: "SHP24680",
    date: "May 2, 2025",
    total: "$834.00",
    paymentMethod: "Credit Card",
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md border-0 shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-white">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-indigo-900">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center bg-white">
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
          </p>
          <div className="bg-indigo-50 p-6 rounded-xl mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{orderDetails.date}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">{orderDetails.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{orderDetails.paymentMethod}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your email address with all the details of your order.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 bg-white">
          <Link href="/orders" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">View Order</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              Continue Shopping
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
