// app/payment-success/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useQuery } from "@tanstack/react-query"; // Import useQuery

// Update interface based on expected backend data
interface OrderDetails {
  orderNumber: string;
  date: string; // You might want to use a Date type here
  total: string; // You might want to use a number type here
  paymentMethod: string;
  // Add other fields you expect from the backend, e.g., items, shipping address
  items: Array<{
    name: string;
    quantity: number;
    price: string; // or number
  }>;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Get orderId from query params

  // Use react-query to fetch order details
  const { data: orderDetails, isLoading, isError, error } = useQuery<OrderDetails, Error>({
    queryKey: ["orderDetails", orderId], // Unique query key
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID not provided");
      }
      // Fetch order details from your backend API
      const response = await fetch(`/api/orders/${orderId}`); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      return response.json();
    },
    enabled: !!orderId, // Only run the query if orderId exists
  });

  if (isLoading) {
    return <div>Loading order details...</div>;
  }

  if (isError) {
    return <div>Error loading order details: {error.message}</div>;
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Thank you for your order. Your payment has been processed successfully.</p>
          <div className="border-t border-b border-gray-200 py-4 text-left">
            <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
            <p><strong>Date:</strong> {new Date(orderDetails.date).toLocaleDateString()}</p> {/* Format date */}
            <p><strong>Total:</strong> {orderDetails.total}</p>
            <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
            {/* Display items and shipping address */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Items:</h4>
              <ul>
                {orderDetails.items.map((item, index) => (
                  <li key={index}>{item.name} ({item.quantity}) - {item.price}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Shipping Address:</h4>
              <p>{orderDetails.shippingAddress.line1}</p>
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postal_code}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">An email confirmation has been sent to your inbox.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" passHref>
            <Button>Continue Shopping</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
