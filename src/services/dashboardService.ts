import { api } from './api';
import { DashboardStats, ActivityItem } from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock dashboard stats
const mockStats: DashboardStats = {
  totalProjects: 24,
  aiGenerations: 156,
  usageStats: 89,
  activeUsers: 12,
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      await mockDelay(600);
      return mockStats;
    }
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10): Promise<ActivityItem[]> => {
    try {
      const response = await api.get<ActivityItem[]>('/api/projects', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      await mockDelay(400);
      return [];
    }
  },
};

export default dashboardService;
