import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product properties as needed
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
}));































