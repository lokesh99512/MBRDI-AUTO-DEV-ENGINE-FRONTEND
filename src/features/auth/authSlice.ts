import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, SignupPayload } from '@/types';
import { extractUserFromToken } from '@/utils/jwt';

// Restore user from token on initialization
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const user = token ? extractUserFromToken(token) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user?: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || null;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },

    // Signup actions
    signupRequest: (state, _action: PayloadAction<SignupPayload>) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ user?: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || null;
      state.token = action.payload.token;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },

    // Logout actions
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },

    // Get current user actions
    getCurrentUserRequest: (state) => {
      state.loading = true;
    },
    getCurrentUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getCurrentUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update profile actions
    updateProfileRequest: (state, _action: PayloadAction<Partial<User>>) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logoutRequest,
  logoutSuccess,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
