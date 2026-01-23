import { api } from './api';
import API_CONFIG from '@/config/api.config';
import { 
  Project, 
  CreateProjectPayload, 
  UpdateProjectPayload,
  ProjectFilters,
  PaginatedResponse 
} from '@/types';

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
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  /**
   * Generate AI output for project
   * POST /api/projects/:id/generate
   */
  // NOTE: AI generation endpoints are not defined in your provided backend cURLs.
  // Keep this method for future use, but it will fail until the backend supports it.
  generateOutput: async (_projectId: string | number) => {
    throw new Error('AI generation endpoint is not configured on the backend yet');
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
      throw new Error(error.response?.data?.message || 'Failed to regenerate project');
    }
  },
};

export default projectService;
