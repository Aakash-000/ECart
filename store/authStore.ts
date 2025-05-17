import { create } from 'zustand';

export interface AuthState {
  user: any | null; // Add user state
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  initializeAuthState: () => Promise<void>;
  setUser: (user: any | null) => void; // Add action to set user
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // Initialize user to null
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/authenticated'); // Or any protected route
      if (response.ok) {
        set({ isAuthenticated: true, isLoading: false });
        // You might want to fetch user data here if your /api/authenticated endpoint doesn't return it
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
      // If the backend returns user data with the authentication check, update the user state here as well.
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async () => {
    await get().checkAuth();
    // After checking auth, if isAuthenticated is true, fetch user data
    if (get().isAuthenticated) {
      try {
        const userResponse = await fetch('http://localhost:3000/api/user'); // Replace with your user data endpoint
        if (userResponse.ok) {
          const userData = await userResponse.json();
          get().setUser(userData); // Set the user data in the store
        } else {
          console.error('Failed to fetch user data after login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },

  logout: () => {
    // Remove the token from the cookie (assuming your backend API handles this)
    // If you manage cookies on the frontend, you would remove it here.
    // Example using `js-cookie`: Cookies.remove('auth-token');
    set({ isAuthenticated: false, isLoading: false, user: null }); // Reset the state and clear user data
  },
  setUser: (user) => {
    set({ user });
  },

  initializeAuthState: async () => {
    await get().checkAuth();
  },
}));

export { useAuthStore };