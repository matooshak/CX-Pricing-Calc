import { create } from 'zustand';
import { UserRole, User as AuthUser } from './authStore';

export interface User extends AuthUser {
  vpsMargin?: number;
  baasMargin?: number;
  children?: User[];
}

interface MarginRates {
  vpsMargin: number;
  baasMargin: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  parentResellerId?: string;
  createdBy?: string; // ID of the user who created this user
  vpsMargin?: number;
  baasMargin?: number;
  children?: User[];
  password?: string; // Only for internal use, not stored in the actual user object
}

// Type for user updates that includes the password field
interface UserUpdate extends Omit<User, 'id' | 'children'> {
  password?: string;
}

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'children'>) => void;
  updateUser: (id: string, data: Partial<UserUpdate>, password?: string) => void;
  deleteUser: (id: string) => void;
  setSubResellerParent: (subResellerId: string, parentResellerId: string) => void;
  resetPassword: (id: string, newPassword: string) => void;
  getResellers: () => User[];
  getSubResellers: (resellerId: string) => User[];
  getEffectiveMargins: (userId: string) => MarginRates;
  getUserHierarchy: () => User[];
  getAvailableParentResellers: (currentUserId?: string) => User[];
  isUserInHierarchy: (users: User[], userId: string, targetId?: string) => boolean;
}

// Initial demo data with margins
const initialUsers: User[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: 'admin',
    vpsMargin: 0,
    baasMargin: 0
  },
  { 
    id: '2', 
    name: 'Reseller One', 
    email: 'reseller1@example.com', 
    role: 'reseller', 
    createdBy: '1',
    vpsMargin: 30,
    baasMargin: 40
  },
  { 
    id: '3', 
    name: 'Reseller Two', 
    email: 'reseller2@example.com', 
    role: 'reseller', 
    createdBy: '1',
    vpsMargin: 25,
    baasMargin: 35
  },
  { 
    id: '4', 
    name: 'Sub-Reseller One', 
    email: 'sub1@example.com', 
    role: 'sub-reseller', 
    parentResellerId: '2', 
    createdBy: '2',
    vpsMargin: 15,
    baasMargin: 20
  },
  { 
    id: '5', 
    name: 'Sub-Reseller Two', 
    email: 'sub2@example.com', 
    role: 'sub-reseller', 
    parentResellerId: '3',
    createdBy: '1',
    vpsMargin: 10,
    baasMargin: 15
  },
];

// Helper function to build user hierarchy
const buildUserHierarchy = (users: User[], parentId?: string): User[] => {
  return users
    .filter(user => user.parentResellerId === parentId)
    .map(user => ({
      ...user,
      children: buildUserHierarchy(users, user.id)
    }));
};

// Helper function to calculate effective margins
const calculateEffectiveMargins = (users: User[], userId: string): MarginRates => {
  const user = users.find(u => u.id === userId);
  if (!user) return { vpsMargin: 0, baasMargin: 0 };

  let vpsMargin = user.vpsMargin || 0;
  let baasMargin = user.baasMargin || 0;
  
  // If this is a sub-reseller, add parent's margins
  if (user.parentResellerId) {
    const parentMargins = calculateEffectiveMargins(users, user.parentResellerId);
    vpsMargin += parentMargins.vpsMargin;
    baasMargin += parentMargins.baasMargin;
  }
  
  return { vpsMargin, baasMargin };
};

// Helper function to check if a user is in another user's hierarchy
const checkUserInHierarchy = (users: User[], userId: string, targetId?: string): boolean => {
  if (!targetId) return false;
  const user = users.find(u => u.id === targetId);
  if (!user) return false;
  if (user.id === userId) return true;
  if (user.parentResellerId) {
    return checkUserInHierarchy(users, userId, user.parentResellerId);
  }
  return false;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: initialUsers,
  
  // Get all resellers (for admin to assign parent resellers)
  getResellers: () => get().users.filter(user => user.role === 'reseller'),
  
  // Get sub-resellers for a specific reseller
  getSubResellers: (resellerId: string) => 
    get().users.filter(user => user.parentResellerId === resellerId),
    
  // Get effective margins including parent margins
  getEffectiveMargins: (userId: string) => {
    const users = get().users;
    return calculateEffectiveMargins(users, userId);
  },
  
  // Get user hierarchy for display
  getUserHierarchy: () => {
    const users = get().users;
    return buildUserHierarchy(users, undefined);
  },
  
  // Get all possible parent resellers for a user
  getAvailableParentResellers: (currentUserId?: string) => {
    const { users } = get();
    return users.filter(user => 
      user.role === 'reseller' && 
      user.id !== currentUserId &&
      !isUserInHierarchy(users, user.id, currentUserId)
    );
  },
  
  // Use the helper function to check hierarchy
  isUserInHierarchy: (users, userId, targetId) => checkUserInHierarchy(users, userId, targetId),
  
  // Add a new user with default margins based on role
  addUser: (userData) => set((state) => {
    const newId = String(state.users.length + 1);
    const newUser = { 
      ...userData, 
      id: newId,
      // Set default margins if not provided
      vpsMargin: userData.vpsMargin ?? (userData.role === 'sub-reseller' ? 10 : 30),
      baasMargin: userData.baasMargin ?? (userData.role === 'sub-reseller' ? 15 : 40)
    };
    return { users: [...state.users, newUser] };
  }),
  
  updateUser: (id, data, password?) => set((state) => {
    const userToUpdate = state.users.find(user => user.id === id);
    if (!userToUpdate) return state;

    // If changing parent reseller, ensure it's valid
    if (data.parentResellerId) {
      const user = state.users.find(u => u.id === id);
      if (user?.role !== 'sub-reseller') {
        console.error('Only sub-resellers can have a parent reseller');
      }
    }

    // Create the updated user object
    const updatedUser = { ...userToUpdate, ...data };

    // If password is provided, include it in the update
    if (password) {
      // Add password to the user object for the update
      (updatedUser as UserUpdate).password = password;
    }

    return {
      users: state.users.map(user => 
        user.id === id ? updatedUser : user
      ),
    };
  }),

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

// Helper function to check if a user is in another user's hierarchy
function isUserInHierarchy(users: User[], userId: string, targetId?: string): boolean {
  if (!targetId) return false;
  const user = users.find(u => u.id === targetId);
  if (!user) return false;
  if (user.id === userId) return true;
  if (user.parentResellerId) {
    return isUserInHierarchy(users, userId, user.parentResellerId);
  }
  return false;
}