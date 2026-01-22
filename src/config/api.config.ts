// API Configuration
// In production, set VITE_API_BASE_URL environment variable
// For development, defaults to localhost:8080

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
    },
    PROJECTS: {
      BASE: '/api/projects',
      BY_ID: (id: string | number) => `/api/projects/${id}`,
    },
    USERS: {
      BASE: '/api/users',
      BY_ID: (id: string | number) => `/api/users/${id}`,
    },
    DASHBOARD: {
      STATS: '/api/dashboard/stats',
      ACTIVITY: '/api/dashboard/activity',
    },
    SETTINGS: {
      PROFILE: '/api/settings/profile',
      PASSWORD: '/api/settings/password',
      PREFERENCES: '/api/settings/preferences',
    },
  },
};

export default API_CONFIG;
