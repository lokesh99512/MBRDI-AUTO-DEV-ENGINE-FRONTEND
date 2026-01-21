import { api } from './api';
import { User } from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'felix.baumgartner@company.com',
    firstName: 'Felix',
    lastName: 'Baumgartner',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-21T08:00:00Z',
  },
  {
    id: '2',
    email: 'maria.schmidt@company.com',
    firstName: 'Maria',
    lastName: 'Schmidt',
    role: 'manager',
    createdAt: '2024-01-16T14:00:00Z',
    lastLogin: '2024-01-20T16:30:00Z',
  },
  {
    id: '3',
    email: 'hans.mueller@company.com',
    firstName: 'Hans',
    lastName: 'Mueller',
    role: 'user',
    createdAt: '2024-01-17T09:00:00Z',
    lastLogin: '2024-01-21T07:45:00Z',
  },
  {
    id: '4',
    email: 'anna.weber@company.com',
    firstName: 'Anna',
    lastName: 'Weber',
    role: 'user',
    createdAt: '2024-01-18T11:00:00Z',
    lastLogin: '2024-01-19T15:00:00Z',
  },
];

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error) {
      await mockDelay(600);
      return mockUsers;
    }
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      await mockDelay(400);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  // Create user
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      const response = await api.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      await mockDelay(800);
      const newUser: User = {
        ...userData,
        id: String(mockUsers.length + 1),
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },

  // Update user role
  updateUserRole: async (id: string, role: User['role']): Promise<User> => {
    try {
      const response = await api.patch<User>(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      await mockDelay(500);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      user.role = role;
      return user;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      await mockDelay(500);
      const index = mockUsers.findIndex(u => u.id === id);
      if (index > -1) mockUsers.splice(index, 1);
    }
  },
};

export default userService;
