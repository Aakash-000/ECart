import { create } from 'zustand';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  initializeAuthState: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/authenticated'); // Or any protected route
      if (response.ok) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async () => {
    // Assuming the backend sets the cookie on successful login response
    await get().checkAuth();
  },

  logout: async () => {
    await fetch('/api/logout', { method: 'POST' });
    set({ isAuthenticated: false });
  },

  initializeAuthState: async () => {
    await get().checkAuth();
  },
}));

export { useAuthStore };