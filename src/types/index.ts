// ============================================
// GLOBAL TYPE DEFINITIONS
// ============================================

// User & Authentication Types
export interface User {
  id: number;
  userId?: number;
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: 'TENANT_ADMIN' | 'USER' | 'admin' | 'user' | 'manager';
  tenantId?: number;
  tenantName?: string;
  avatar?: string;
  createdAt?: string;
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
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  tenantName: string;
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

// JWT Payload decoded from token
export interface JWTPayload {
  sub: string; // username
  userId: number;
  email: string;
  tenantId: number;
  role?: string;
  iat: number;
  exp: number;
}

// Project Types
export type ProjectType = 'web' | 'microservice' | 'fullstack';
export type TechnologyStack = 'react' | 'angular' | 'vue' | 'node' | 'python' | 'java' | 'dotnet' | 'go';
export type ProjectStatus = 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED' | 'pending' | 'generating' | 'completed' | 'failed';

export interface Project {
  id: number | string;
  name: string;
  description: string;
  status: ProjectStatus;
  type?: ProjectType;
  technologies?: TechnologyStack[];
  gitRepoUrl?: string | null;
  baseBranch?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  tenantId?: number;
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
  description: string;
  status?: ProjectStatus;
  type?: ProjectType;
  technologies?: TechnologyStack[];
}

export interface UpdateProjectPayload {
  id: number | string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  gitRepoUrl?: string | null;
  baseBranch?: string;
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
