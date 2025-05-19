'use client'

import { useForm } from 'react-hook-form';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { Product } from '@/types/product';

interface ProductFormInputs {
  name: string;
  price: number;
  description: string;
}

const ProductForm = () => {
  const { register, handleSubmit, reset } = useForm<ProductFormInputs>();
  const addProduct = useProductStore((state) => state.addProduct);
  const { user } = useAuthStore();

  const onSubmit = async (data: ProductFormInputs) => {
    if (!user) {
      console.error('User not authenticated.');
      // Optionally show a toast or other notification
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Assuming the user object contains a token
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      addProduct(newProduct); // Add the product returned from the backend
      reset();
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { required: true, valueAsNumber: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;