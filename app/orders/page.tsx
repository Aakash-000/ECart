// app/orders/page.tsx

"use client"; // This is a client component

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderSummary } from "@/types/order"; // Import the OrderSummary interface

const fetchUserOrders = async (): Promise<OrderSummary[]> => {
  // Assuming your backend is at /api/orders and requires authentication
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
    credentials:"include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
  }

  return response.json();
};

const OrdersPage = () => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery<OrderSummary[], Error>({
    queryKey: ["userOrders"], // Unique query key for user orders
    queryFn: fetchUserOrders,
  });

  if (isLoading) {
    return <div className="container mx-auto mt-8">Loading orders...</div>;
  }

  if (isError) {
    return (
      <div className="container mx-auto mt-8 text-red-500">
        Error fetching orders: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800' // Default for other statuses
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Date: {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-gray-800 font-bold">Total: ${parseFloat(order.total).toFixed(2)}</p> {/* Convert total to number and format */}
              {/* You can add more details here, like a link to the order details page */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">You haven't placed any orders yet.</div>
      )}
    </div>
  );
};

export default OrdersPage;
