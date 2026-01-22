import api from './api';
import API_CONFIG from '@/config/api.config';
import { User } from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    email: 'felix.baumgartner@company.com',
    username: 'felix_admin',
    firstName: 'Felix',
    lastName: 'Baumgartner',
    role: 'TENANT_ADMIN',
    tenantId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-21T08:00:00Z',
  },
  {
    id: 2,
    email: 'maria.schmidt@company.com',
    username: 'maria_user',
    firstName: 'Maria',
    lastName: 'Schmidt',
    role: 'USER',
    tenantId: 1,
    createdAt: '2024-01-16T14:00:00Z',
    lastLogin: '2024-01-20T16:30:00Z',
  },
  {
    id: 3,
    email: 'hans.mueller@company.com',
    username: 'hans_user',
    firstName: 'Hans',
    lastName: 'Mueller',
    role: 'USER',
    tenantId: 1,
    createdAt: '2024-01-17T09:00:00Z',
    lastLogin: '2024-01-21T07:45:00Z',
  },
  {
    id: 4,
    email: 'anna.weber@company.com',
    username: 'anna_user',
    firstName: 'Anna',
    lastName: 'Weber',
    role: 'USER',
    tenantId: 1,
    createdAt: '2024-01-18T11:00:00Z',
    lastLogin: '2024-01-19T15:00:00Z',
  },
];

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>(API_CONFIG.ENDPOINTS.USERS.BASE);
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(600);
        return mockUsers;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUser: async (id: string | number): Promise<User> => {
    try {
      const response = await api.get<User>(API_CONFIG.ENDPOINTS.USERS.BY_ID(id));
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(400);
        const user = mockUsers.find(u => u.id === Number(id));
        if (!user) throw new Error('User not found');
        return user;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Create user
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      const response = await api.post<User>(API_CONFIG.ENDPOINTS.USERS.BASE, userData);
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(800);
        const newUser: User = {
          ...userData,
          id: mockUsers.length + 1,
          createdAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user role
  updateUserRole: async (id: string | number, role: User['role']): Promise<User> => {
    try {
      const response = await api.patch<User>(`${API_CONFIG.ENDPOINTS.USERS.BY_ID(id)}/role`, { role });
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(500);
        const user = mockUsers.find(u => u.id === Number(id));
        if (!user) throw new Error('User not found');
        user.role = role;
        return user;
      }
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  },

  // Delete user
  deleteUser: async (id: string | number): Promise<void> => {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.USERS.BY_ID(id));
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(500);
        const index = mockUsers.findIndex(u => u.id === Number(id));
        if (index > -1) mockUsers.splice(index, 1);
        return;
      }
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
};

export default userService;
