import { create } from 'zustand';

export type UserRole = 'admin' | 'reseller' | 'sub-reseller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  parentResellerId?: string;
  createdBy?: string;
  vpsMargin?: number;
  baasMargin?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Set to false by default
  login: (user: User) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));