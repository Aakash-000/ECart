// app/orders/page.tsx

"use client"; // This is a client component

import React from "react";
import { useQuery } from "@tanstack/react-query";
// Import the OrderSummary interface and add details for items and shipping address
interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface ShippingAddress {
  line1: string;
  city: string;
  state: string;
  postal_code: string;
}

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

// Update the OrderSummary interface to include items and shippingAddress
interface OrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  paymentMethod: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
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
  console.log(orders)
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

              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 text-sm">
                      {item.name} (x{item.quantity}) - ${parseFloat(item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Shipping Address:</h3>
                <p className="text-gray-700 text-sm">{order.shippingAddress.line1}</p>
                <p className="text-gray-700 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
              </div>

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
