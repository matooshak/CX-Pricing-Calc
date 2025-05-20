import { create } from 'zustand';
import { UserRole } from './authStore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  parentResellerId?: string;
  createdBy?: string; // ID of the user who created this user
}

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: string) => void;
  setSubResellerParent: (subResellerId: string, parentResellerId: string) => void;
  resetPassword: (id: string, newPassword: string) => void;
}

// Initial demo data
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Reseller One', email: 'reseller1@example.com', role: 'reseller', createdBy: '1' },
  { id: '3', name: 'Reseller Two', email: 'reseller2@example.com', role: 'reseller', createdBy: '1' },
  { id: '4', name: 'Sub-Reseller One', email: 'sub1@example.com', role: 'sub-reseller', parentResellerId: '2', createdBy: '2' },
  { id: '5', name: 'Sub-Reseller Two', email: 'sub2@example.com', role: 'sub-reseller', parentResellerId: '3', createdBy: '1' },
];

export const useUsersStore = create<UsersState>((set) => ({
  users: initialUsers,
  
  addUser: (userData) => set((state) => {
    const newId = String(state.users.length + 1);
    return { users: [...state.users, { id: newId, ...userData }] };
  }),
  
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...data } : user
    ),
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id),
  })),
  
  setSubResellerParent: (subResellerId, parentResellerId) => set((state) => ({
    users: state.users.map(user => 
      user.id === subResellerId 
        ? { ...user, parentResellerId } 
        : user
    ),
  })),
  
  resetPassword: (id, newPassword) => set((state) => ({
    users: state.users.map(user =>
      user.id === id
        ? { ...user, password: newPassword }
        : user
    ),
  })),
}));