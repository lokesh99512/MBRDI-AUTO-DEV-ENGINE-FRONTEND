import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, UserSettings } from '@/types';

const initialState: SettingsState = {
  settings: {
    theme: 'light',
    language: 'en',
    notifications: true,
    emailUpdates: true,
  },
  loading: false,
  error: null,
  passwordChangeLoading: false,
  passwordChangeError: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Fetch settings
    fetchSettingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSettingsSuccess: (state, action: PayloadAction<UserSettings>) => {
      state.loading = false;
      state.settings = action.payload;
    },
    fetchSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update settings
    updateSettingsRequest: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.loading = true;
      state.error = null;
    },
    updateSettingsSuccess: (state, action: PayloadAction<UserSettings>) => {
      state.loading = false;
      state.settings = action.payload;
    },
    updateSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Change password
    changePasswordRequest: (state, action: PayloadAction<{ currentPassword: string; newPassword: string }>) => {
      state.passwordChangeLoading = true;
      state.passwordChangeError = null;
    },
    changePasswordSuccess: (state) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
    },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = action.payload;
    },

    // Clear errors
    clearSettingsError: (state) => {
      state.error = null;
      state.passwordChangeError = null;
    },
  },
});

export const {
  fetchSettingsRequest,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  clearSettingsError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
