import { create } from 'zustand';

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  initializeAuthState: () => Promise<void>;
  setUser: (user: any | null) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await fetch('http://localhost:3000/api/authenticated', {method: 'GET', credentials: 'include'})
      if (res.ok) {
        try {
          const response = await fetch('http://localhost:3000/api/user', {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const userData = await response.json();
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }catch (error) {
      console.error('Error checking authentication:', error);
      set({
        user: null,
        isAuthenticated: false,
      })
    }
    },

  login: async () => {
    await get().checkAuth();
  },

  logout: () => {
    // You can also call your API logout endpoint here if needed
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user) => {
    set({ isLoading: true });
    set({ user, isLoading: false });
  },

  initializeAuthState: async () => {
    set({ isLoading: true });
    await get().checkAuth();
  },
}));

export { useAuthStore };
