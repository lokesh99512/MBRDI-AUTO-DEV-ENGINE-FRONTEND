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

// Mock recent activity
const mockActivity: ActivityItem[] = [
  {
    id: '1',
    action: 'Created project',
    projectName: 'E-Commerce Platform',
    user: 'Felix Baumgartner',
    timestamp: '2024-01-21T10:30:00Z',
  },
  {
    id: '2',
    action: 'Generated output',
    projectName: 'Analytics Dashboard',
    user: 'Maria Schmidt',
    timestamp: '2024-01-21T09:15:00Z',
  },
  {
    id: '3',
    action: 'Updated project',
    projectName: 'Notification Service',
    user: 'Hans Mueller',
    timestamp: '2024-01-21T08:45:00Z',
  },
  {
    id: '4',
    action: 'Regenerated output',
    projectName: 'User Management API',
    user: 'Felix Baumgartner',
    timestamp: '2024-01-20T16:20:00Z',
  },
  {
    id: '5',
    action: 'Created project',
    projectName: 'Payment Gateway',
    user: 'Anna Weber',
    timestamp: '2024-01-20T14:00:00Z',
  },
];

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
      const response = await api.get<ActivityItem[]>('/dashboard/activity', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      await mockDelay(400);
      return mockActivity.slice(0, limit);
    }
  },
};

export default dashboardService;
