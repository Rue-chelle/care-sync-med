
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
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        console.log('User store: logging in user', user);
        set({ user, isAuthenticated: true });
      },
      register: (user) => {
        console.log('User store: registering user', user);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        console.log('User store: logging out user');
        set({ user: null, isAuthenticated: false });
        // Clear the stored data immediately
        localStorage.removeItem('aloramedapp-user-storage');
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
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('aloramedapp-user-storage');
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
