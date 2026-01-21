// ============================================
// GLOBAL TYPE DEFINITIONS
// ============================================

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Project Types
export type ProjectType = 'web' | 'microservice' | 'fullstack';
export type TechnologyStack = 'react' | 'angular' | 'vue' | 'node' | 'python' | 'java' | 'dotnet' | 'go';
export type ProjectStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  technologies: TechnologyStack[];
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  output?: GenerationOutput;
}

export interface GenerationOutput {
  uiDesign: string;
  frontendCode: string;
  backendCode: string;
  apiEndpoints: string;
  databaseSchema: string;
  documentation: string;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
}

export interface CreateProjectPayload {
  name: string;
  type: ProjectType;
  technologies: TechnologyStack[];
  description: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  aiGenerations: number;
  usageStats: number;
  activeUsers: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  projectName: string;
  user: string;
  timestamp: string;
}

export interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: ActivityItem[];
  loading: boolean;
  error: string | null;
}

// User Management Types
export interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  emailUpdates: boolean;
}

export interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  passwordChangeLoading: boolean;
  passwordChangeError: string | null;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoHide?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}
