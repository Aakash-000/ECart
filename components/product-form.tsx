'use client'

import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { Product } from '@/types/product';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from './ui/use-toast';

const productFormSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().optional(), // Assuming category_id will be handled as a string input for now
  brand: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  image: z.string().optional(), // Assuming image is a URL or path
});

type ProductFormInputs = z.infer<typeof productFormSchema>;

const ProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormInputs>({
    resolver: zodResolver(productFormSchema),
  });
  const { user } = useAuthStore();

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductFormInputs) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if your API requires it
          // 'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(newProduct),
      })
      if (!response.ok) {
        throw new Error('Failed to add product')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate product list cache
      toast({ title: 'Product added successfully!' });
      reset();
    },
    onError: (error) => {
      toast({ title: 'Error adding product', description: error.message, variant: 'destructive' });
    },
  });

  return (
    <form onSubmit={handleSubmit(data => addProductMutation.mutate(data))} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>


      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="any"
          {...register('price', { valueAsNumber: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          id="sku"
          type="text"
          {...register('sku')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
      </div>

      {/* Category ID */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
          Category ID
        </label>
        <input
          id="category_id"
          type="text"
          {...register('category_id')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
      </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
          Brand
        </label>
        <input
          id="brand"
          type="text"
          {...register('brand')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
      </div>

      {/* Weight */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight
        </label>
        <input
          id="weight"
          type="number"
          step="any"
          {...register('weight', { valueAsNumber: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          id="image"
          type="text"
          {...register('image')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

      </div>
      
      {/* Dimensions */}
      <div>
        <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
          Dimensions
        </label>
        <input
          id="dimensions"
          type="text"
          {...register('dimensions')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.dimensions && <p className="text-red-500 text-sm mt-1">{errors.dimensions.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={addProductMutation.isPending}
      >
        {addProductMutation.isPending ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
