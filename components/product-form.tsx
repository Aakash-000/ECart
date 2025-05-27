'use client';

import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
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
 category_id: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: 'Invalid Category ID' }),
  brand: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(), // Allow both string or number
 image: z.any().transform((val) => {
   if (typeof FileList !== "undefined" && val instanceof FileList) {
     return Array.from(val);
   }
   return [];
 })
 .optional()
, // Assuming image is a file
});

type ProductFormInputs = z.infer<typeof productFormSchema>;

const ProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormInputs>({
    defaultValues: {
      name: '',
      price: 0,
 category_id: '', // Set default value for select
    },

    resolver: zodResolver(productFormSchema),
  });
  const { user } = useAuthStore();
  
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductFormInputs) => {
      console.log(newProduct)
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value as any);
        }
      });

      if (newProduct.image && newProduct.image.length > 0) {
        // If you expect only one image, append the first file
        formData.append('image', newProduct.image[0]);
  
        // If you expect multiple images, loop through the array and append each with 'image[]'
        // newProduct.image.forEach((file: File) => {
        //   formData.append('image[]', file);
        // });
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, { // Assuming a dedicated upload endpoint
        method: 'POST',
        body: formData,
        credentials:"include"
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

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,{method:"GET", credentials:"include"});
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  return (
    <form onSubmit={handleSubmit(data => addProductMutation.mutate(data))} className="space-y-4" encType="multipart/form-data">
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
          Category 
 </label>
        {isLoadingCategories && <p>Loading categories...</p>}
        {categoriesError && <p className="text-red-500 text-sm mt-1">Error loading categories: {categoriesError.message}</p>}
        {!isLoadingCategories && !categoriesError && (
 <select
          id="category_id"
          {...register('category_id')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
 >
            <option value="">Select a category</option>
            {categories?.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
 ))}
 </select>
 )}
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

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          id="image"
          type="file"
          {...register('image', { required: false })}
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
