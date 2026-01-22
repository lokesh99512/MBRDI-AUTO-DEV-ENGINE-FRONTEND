import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import API_CONFIG from '@/config/api.config';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized - Clear token and redirect to login
      if (status === 401) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden. Insufficient permissions.');
      }
      
      // Handle 500 Internal Server Error
      if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put<T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete<T>(url, config),
};

export default apiClient;
