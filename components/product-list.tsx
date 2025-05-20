import React from 'react';
import { Product } from '../types/product';
import { useQuery } from '@tanstack/react-query';

const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      // Note: Authentication should be handled in an API interceptor or similar mechanism
      // for better separation of concerns and reusability.
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`); // Use relative path if within the same origin
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

  return (
    <div>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <ul>
          {products.map((product: Product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Description: {product.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;