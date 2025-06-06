// store/orderHistoryStore.ts
import { create } from 'zustand';

interface Order {
  orderNumber: string;
  date: string;
  total: string;
  paymentMethod: string;
  // Include other relevant order details you want to store in history
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

interface OrderHistoryState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearHistory: () => void; // Optional: for clearing history
}

export const useOrderHistoryStore = create<OrderHistoryState>((set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  clearHistory: () => set({ orders: [] }),
}));
