import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { Product } from '../types/product';
import { useAuthStore } from '@/store/authStore'; // Assuming authStore is in @/store

const ProductList: React.FC = () => {
  const { products, setProducts } = useProductStore((state) => ({
    products: state.products,
    setProducts: state.setProducts,
  }));
  const { user } = useAuthStore(); // Access the user object which might contain the token

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !user.token) {
        console.error("User not authenticated or token not available.");
        // Optionally set an error state or display a message
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Optionally set an error state or display an error message to the user
      }
    };

    fetchProducts();
  }, [user, setProducts]); // Refetch if user changes or setProducts changes

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