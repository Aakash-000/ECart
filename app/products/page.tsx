"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Product } from "@/types/product";

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products');
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Headphones For You!</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6 overflow-x-auto pb-2">
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Headphone Type</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Price</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Review</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Color</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Material</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Offer</span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center border rounded-full px-3 py-1 bg-indigo-600 text-white">
            <span className="text-sm font-medium mr-1">All Filters</span>
            <SlidersHorizontal size={16} />
          </div>

          <div className="ml-auto flex items-center border rounded-full px-3 py-1">
            <span className="text-sm font-medium mr-1">Sort by</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {isLoading && <div className="text-center">Loading products...</div>}
        {isError && <div className="text-center text-red-500">Error: {error.message}</div>}

        {!isLoading && !isError && (!products || products.length === 0) && (
            <div className="text-center">No products found.</div>
        )}


        {!isLoading && !isError && products && products.length > 0 && (
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="product-card rounded-2xl overflow-hidden group">
                  <div className="relative h-48 bg-gray-50">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-indigo-50 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                            stroke="#4F46E5"
                            strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-bold text-indigo-900">${product.price}</span>
                      {product.originalPrice && (
                          <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={i < product.rating ? "#FBBF24" : "none"}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                                      stroke={i < product.rating ? "#FBBF24" : "#CBD5E0"}
                                      strokeWidth="1.5"
                                  />
                                </svg>
                            ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                    <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">Add to Cart</Button>
                  </div>
                </div>
              </Link>
          ))}
        </div>
        )}
      </div>
  )
}
