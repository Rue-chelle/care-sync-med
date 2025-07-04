
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserRole = "patient" | "doctor" | "admin" | "super_admin";

interface User {
  id: string;
  fullName?: string;
  email: string;
  role: UserRole;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => {
        console.log('User store: logging in user', user);
        set({ user, isAuthenticated: true, isLoading: false });
      },
      register: (user) => {
        console.log('User store: registering user', user);
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        console.log('User store: logging out user');
        set({ user: null, isAuthenticated: false, isLoading: false });
        // Clear the stored data immediately
        try {
          localStorage.removeItem('aloramedapp-user-storage');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
      },
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          console.log('User store: updating user', updatedUser);
          set({ user: updatedUser });
        }
      },
      clearUser: () => {
        console.log('User store: clearing user data');
        set({ user: null, isAuthenticated: false, isLoading: false });
        try {
          localStorage.removeItem('aloramedapp-user-storage');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "aloramedapp-user-storage",
      version: 1,
      skipHydration: false,
      // Add storage event listener to sync across tabs
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('User store: rehydrated with state', state);
        }
      },
    }
  )
);
