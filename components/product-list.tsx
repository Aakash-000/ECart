import React from 'react';
import { Product } from '../types/product';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

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
          {products.map((product: Product) => (
            <li key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                {product.image_url ? (
              <Image 
                       src={`http://localhost:3000${product.image_url}`} // Construct the full image URL
                       alt={product.name || 'Product Image'} // Use product name as alt text
                       layout="fill" // Or 'responsive', depending on your styling needs
                       objectFit="cover" // Or 'contain', depending on how you want the image to fit
                     />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">No Image</div> // Placeholder
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700">${product.price}</p>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;