import React from 'react';
import { Product } from '../types/product';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      // Note: Authentication should be handled in an API interceptor or similar mechanism
      // for better separation of concerns and reusability.
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,{method:"GET",credentials:"include"}); // Use relative path if within the same origin
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error fetching products: {error.message}</div>;
  }
  console.log(products)
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <Link href={`/products/${product.id}`} key={product.id}>
      <div className="product-card rounded-2xl overflow-hidden group bg-white shadow-md">
        <div className="relative h-48 bg-gray-50">
          {product.image_url ? (
            <Image
              src={`http://localhost:3000${product.image_url}`}
              alt={product.name || 'Product Image'}
              fill
              className="object-contain p-4"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">No Image</div>
          )}
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
                    fill={i < product?.rating ? "#FBBF24" : "none"}
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
            <span className="text-xs text-gray-500 ml-1">({product.reviews || 0})</span>
          </div>
          <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>
      )}
    </div>
  );
};

export default ProductList;