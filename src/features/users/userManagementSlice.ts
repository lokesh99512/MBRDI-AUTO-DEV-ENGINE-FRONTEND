import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserManagementState, User } from '@/types';

const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    // Fetch users
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create user
    createUserRequest: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) => {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.users.push(action.payload);
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user role
    updateUserRoleRequest: (state, action: PayloadAction<{ id: string; role: User['role'] }>) => {
      state.loading = true;
      state.error = null;
    },
    updateUserRoleSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index > -1) {
        state.users[index] = action.payload;
      }
    },
    updateUserRoleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete user
    deleteUserRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearUserManagementError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRoleRequest,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  clearUserManagementError,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
