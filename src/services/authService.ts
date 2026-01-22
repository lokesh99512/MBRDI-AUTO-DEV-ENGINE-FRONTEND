import api from './api';
import API_CONFIG from '@/config/api.config';
import { LoginCredentials, LoginResponse, User, SignupPayload } from '@/types';
import { extractUserFromToken } from '@/utils/jwt';

// Mock delay for development
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data for development fallback
const mockUser: User = {
  id: 1,
  email: 'lokesh@mbrdi.com',
  username: 'lokesh_admin',
  name: 'Lokesh',
  role: 'TENANT_ADMIN',
  tenantId: 1,
  tenantName: 'MBRDI Auto Dev',
};

export const authService = {
  /**
   * Login API call
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<{ token: string }>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );
      
      const { token } = response.data;
      
      // Extract user from JWT token
      const user = extractUserFromToken(token);
      
      // Store token based on remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }
      
      return { 
        token, 
        user: user || undefined 
      };
    } catch (error: any) {
      // Development fallback with mock data
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        console.warn('API not available, using mock data');
        await mockDelay(1000);
        
        if (credentials.username === 'lokesh_admin' && credentials.password === 'Admin@123') {
          const mockToken = 'mock-jwt-token-' + Date.now();
          if (credentials.rememberMe) {
            localStorage.setItem('authToken', mockToken);
          } else {
            sessionStorage.setItem('authToken', mockToken);
          }
          return { user: mockUser, token: mockToken };
        }
        
        throw new Error('Invalid username or password');
      }
      
      // Handle API error response
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  },

  /**
   * Signup API call (Create Tenant Account)
   * POST /api/auth/signup
   */
  signup: async (payload: SignupPayload): Promise<LoginResponse> => {
    try {
      const response = await api.post<{ token: string }>(
        API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
        payload
      );
      
      const { token } = response.data;
      const user = extractUserFromToken(token);
      
      localStorage.setItem('authToken', token);
      
      return { token, user: user || undefined };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      throw new Error(message);
    }
  },

  /**
   * Logout - Clear stored tokens
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local cleanup even if API fails
      console.warn('Logout API call failed, clearing local tokens');
    }
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  /**
   * Get current user from stored token
   */
  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await api.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error: any) {
      // Fallback: Extract user from JWT token
      const user = extractUserFromToken(token);
      if (user) {
        return user;
      }
      
      // Development fallback
      if (import.meta.env.DEV) {
        return mockUser;
      }
      
      throw new Error('Failed to get user information');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Get stored auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch<User>(API_CONFIG.ENDPOINTS.SETTINGS.PROFILE, data);
      return response.data;
    } catch (error: any) {
      // Development fallback
      if (import.meta.env.DEV) {
        await mockDelay(800);
        return { ...mockUser, ...data };
      }
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.SETTINGS.PASSWORD, { 
        currentPassword, 
        newPassword 
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },
};

export default authService;
