import create from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null; // You can define a more specific user type
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  login: (token: string, user: any) => void;
  logout: () => void;
  initializeAuthState: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  login: (token, user) => {
    localStorage.setItem('jwtToken', token);
    // You might want to store user info in local storage too,
    // but be mindful of sensitive data.
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('jwtToken');
    // Remove user info from local storage if stored
    set({ token: null, user: null });
  },

  initializeAuthState: () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // In a real application, you would typically verify the token on the server
      // and fetch user information based on the token here.
      // For this example, we'll just set the token.
      set({ token });
      // If user info was stored, retrieve it here too.
    }
  },
}));

export default useAuthStore;