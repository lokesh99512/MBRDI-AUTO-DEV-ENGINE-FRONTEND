import { api } from './api';
import { ExecutionPaginatedResponse, Execution, CreateExecutionRequest } from '@/types/execution';

const EXECUTION_ENDPOINTS = {
  HISTORY: (projectId: string | number) => `/api/executions/history/${projectId}`,
  CREATE: (projectId: string | number) => `/api/executions/${projectId}`,
};

export const executionService = {
  /**
   * Get execution history for a project with pagination
   * GET /api/executions/history/{projectId}?page=0&size=25
   */
  getExecutionHistory: async (
    projectId: string | number,
    page: number = 0,
    size: number = 25
  ): Promise<ExecutionPaginatedResponse> => {
    try {
      const response = await api.get<ExecutionPaginatedResponse>(
        EXECUTION_ENDPOINTS.HISTORY(projectId),
        { params: { page, size } }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch execution history');
    }
  },

  /**
   * Create a new execution with a prompt
   * POST /api/executions/{projectId}
   */
  createExecution: async (
    projectId: string | number,
    data: CreateExecutionRequest
  ): Promise<Execution> => {
    try {
      const response = await api.post<Execution>(
        EXECUTION_ENDPOINTS.CREATE(projectId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create execution');
    }
  },
};

export default executionService;
