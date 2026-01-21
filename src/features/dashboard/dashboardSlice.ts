import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, DashboardStats, ActivityItem } from '@/types';

const initialState: DashboardState = {
  stats: null,
  recentActivity: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Fetch stats
    fetchStatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action: PayloadAction<DashboardStats>) => {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch recent activity
    fetchActivityRequest: (state, action: PayloadAction<number | undefined>) => {
      state.loading = true;
      state.error = null;
    },
    fetchActivitySuccess: (state, action: PayloadAction<ActivityItem[]>) => {
      state.loading = false;
      state.recentActivity = action.payload;
    },
    fetchActivityFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchActivityRequest,
  fetchActivitySuccess,
  fetchActivityFailure,
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
