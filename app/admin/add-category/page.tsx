'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

async function createCategory(data: { name: string; parent_id: number | null }) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to add category');
  }
  return res.json();
}

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  parent_id: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: 'Invalid Parent Category ID' }),
});

type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

export default function AddCategoryPage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      parent_id: '',
    },
  });

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully!');
      reset();
    },
    onError: (error) => {
      toast.error(`Error adding category: ${error.message}`);
    },
  });

  const onSubmit = (data: CategoryFormInputs) => {
    createCategoryMutation.mutate({ name: data.name, parent_id: data.parent_id ? Number(data.parent_id) : null });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-gray-700 text-sm font-bold mb-2">
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="parentCategory" className="block text-gray-700 text-sm font-bold mb-2">
            Parent Category:
          </label>
          {isLoadingCategories && <p>Loading categories...</p>}
          {categoriesError && <p className="text-red-500 text-xs italic mt-1">Error loading categories</p>}
          {!isLoadingCategories && !categoriesError && (
            <select
              id="parentCategory"
              {...register('parent_id')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">-- Select Parent Category (Optional) --</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.parent_id && (
            <p className="text-red-500 text-xs italic mt-1">{errors.parent_id.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
}