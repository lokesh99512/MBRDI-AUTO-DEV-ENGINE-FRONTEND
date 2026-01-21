import { api } from './api';
import { LoginCredentials, LoginResponse, User } from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'felix.baumgartner@company.com',
  firstName: 'Felix',
  lastName: 'Baumgartner',
  role: 'admin',
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: new Date().toISOString(),
};

export const authService = {
  // Login API call
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Attempt real API call first
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback to mock data for development
      await mockDelay(1000);
      
      // Mock validation
      if (credentials.email === 'demo@company.com' && credentials.password === 'password') {
        const token = 'mock-jwt-token-' + Date.now();
        if (credentials.rememberMe) {
          localStorage.setItem('authToken', token);
        } else {
          sessionStorage.setItem('authToken', token);
        }
        return { user: mockUser, token };
      }
      
      throw new Error('Invalid email or password');
    }
  },

  // Logout API call
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with local cleanup even if API fails
    }
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      // Fallback to mock data
      await mockDelay(500);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        return mockUser;
      }
      throw new Error('Not authenticated');
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      await mockDelay(800);
      if (currentPassword === 'wrongpassword') {
        throw new Error('Current password is incorrect');
      }
      // Mock success
    }
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch<User>('/auth/profile', data);
      return response.data;
    } catch (error) {
      await mockDelay(800);
      return { ...mockUser, ...data };
    }
  },
};

export default authService;
