import { api } from './api';
import API_CONFIG from '@/config/api.config';
import { 
  Project, 
  CreateProjectPayload, 
  UpdateProjectPayload,
  GenerationOutput, 
  ProjectFilters,
  PaginatedResponse 
} from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'AutoDev Engine',
    description: 'MBRDI AI Automation Platform',
    status: 'ACTIVE',
    type: 'fullstack',
    technologies: ['react', 'node', 'python'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T12:30:00Z',
    createdBy: '1',
    output: {
      uiDesign: '// UI Design specifications...',
      frontendCode: '// React frontend code...',
      backendCode: '// Node.js backend code...',
      apiEndpoints: '// API endpoint definitions...',
      databaseSchema: '// PostgreSQL schema...',
      documentation: '# Project Documentation...',
    },
  },
  {
    id: 2,
    name: 'Vehicle Dashboard',
    description: 'Real-time vehicle monitoring system',
    status: 'IN_PROGRESS',
    type: 'web',
    technologies: ['react', 'python'],
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: '1',
  },
  {
    id: 3,
    name: 'Fleet Management',
    description: 'Enterprise fleet tracking and management',
    status: 'COMPLETED',
    type: 'microservice',
    technologies: ['node', 'go'],
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
    createdBy: '2',
  },
];

// Mock generation output
const generateMockOutput = (projectName: string): GenerationOutput => ({
  uiDesign: `/* UI DESIGN - ${projectName} */\n\n## Layout Structure\n- Header with navigation\n- Sidebar with menu items\n- Main content area`,
  frontendCode: `// FRONTEND CODE - ${projectName}\n\nimport React from 'react';\n\nexport const Dashboard = () => {\n  return <div>Dashboard</div>;\n};`,
  backendCode: `// BACKEND CODE - ${projectName}\n\nimport express from 'express';\n\nconst router = express.Router();\n\nexport default router;`,
  apiEndpoints: `# API ENDPOINTS - ${projectName}\n\nGET    /api/projects\nPOST   /api/projects\nGET    /api/projects/:id`,
  databaseSchema: `-- DATABASE SCHEMA - ${projectName}\n\nCREATE TABLE projects (\n  id UUID PRIMARY KEY,\n  name VARCHAR(255) NOT NULL\n);`,
  documentation: `# ${projectName} Documentation\n\n## Overview\nThis project was generated using AI.`,
});

export const projectService = {
  /**
   * Get all projects
   * GET /api/projects
   */
  getProjects: async (filters?: ProjectFilters): Promise<PaginatedResponse<Project>> => {
    try {
      const response = await api.get<Project[] | PaginatedResponse<Project>>(
        API_CONFIG.ENDPOINTS.PROJECTS.BASE,
        { params: filters }
      );
      
      // Handle both array and paginated response
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 10,
          totalPages: Math.ceil(response.data.length / (filters?.pageSize || 10)),
        };
      }
      return response.data;
    } catch (error: any) {
      // Development fallback
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        console.warn('API not available, using mock data');
        await mockDelay(800);
        
        let filtered = [...mockProjects];
        
        if (filters?.search) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        
        if (filters?.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        return {
          data: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize,
          totalPages: Math.ceil(filtered.length / pageSize),
        };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  /**
   * Get single project by ID
   * GET /api/projects/:id
   */
  getProject: async (id: string | number): Promise<Project> => {
    try {
      const response = await api.get<Project>(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id));
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(500);
        const project = mockProjects.find(p => p.id === Number(id));
        if (!project) throw new Error('Project not found');
        return { ...project, output: generateMockOutput(project.name) };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  },

  /**
   * Create new project
   * POST /api/projects
   */
  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    try {
      const response = await api.post<Project>(API_CONFIG.ENDPOINTS.PROJECTS.BASE, {
        name: data.name,
        description: data.description,
        status: data.status || 'ACTIVE',
      });
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(1000);
        const newProject: Project = {
          id: Date.now(),
          name: data.name,
          description: data.description,
          status: data.status || 'ACTIVE',
          type: data.type,
          technologies: data.technologies,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
        };
        mockProjects.unshift(newProject);
        return newProject;
      }
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  },

  /**
   * Update project
   * PUT /api/projects/:id
   */
  updateProject: async (payload: UpdateProjectPayload): Promise<Project> => {
    try {
      const { id, ...data } = payload;
      const response = await api.put<Project>(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id), data);
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(600);
        const index = mockProjects.findIndex(p => p.id === Number(payload.id));
        if (index !== -1) {
          mockProjects[index] = { 
            ...mockProjects[index], 
            ...payload,
            updatedAt: new Date().toISOString(),
          };
          return mockProjects[index];
        }
        throw new Error('Project not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  /**
   * Delete project
   * DELETE /api/projects/:id
   */
  deleteProject: async (id: string | number): Promise<void> => {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id));
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(500);
        const index = mockProjects.findIndex(p => p.id === Number(id));
        if (index > -1) mockProjects.splice(index, 1);
        return;
      }
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  /**
   * Generate AI output for project
   * POST /api/projects/:id/generate
   */
  generateOutput: async (projectId: string | number): Promise<GenerationOutput> => {
    try {
      const response = await api.post<GenerationOutput>(
        `${API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(projectId)}/generate`
      );
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(3000);
        const project = mockProjects.find(p => p.id === Number(projectId));
        if (!project) throw new Error('Project not found');
        
        const output = generateMockOutput(project.name);
        project.output = output;
        project.status = 'COMPLETED';
        return output;
      }
      throw new Error(error.response?.data?.message || 'Failed to generate output');
    }
  },

  /**
   * Re-generate project output
   */
  regenerateProject: async (projectId: string | number, description?: string): Promise<Project> => {
    try {
      const response = await api.post<Project>(
        `${API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(projectId)}/regenerate`,
        { description }
      );
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
        await mockDelay(2500);
        const project = mockProjects.find(p => p.id === Number(projectId));
        if (!project) throw new Error('Project not found');
        
        project.output = generateMockOutput(project.name);
        project.updatedAt = new Date().toISOString();
        return project;
      }
      throw new Error(error.response?.data?.message || 'Failed to regenerate project');
    }
  },
};

export default projectService;
