
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
      },
    }),
    {
      name: "aloramedapp-user-storage",
      // Add version to handle migration if needed
      version: 1,
      // Skip persisting during hydration issues
      skipHydration: false,
    }
  )
);
