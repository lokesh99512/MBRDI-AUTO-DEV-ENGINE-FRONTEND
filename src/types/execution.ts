// Execution History Types

export type ExecutionStatus = 'COMPLETED' | 'FAILED';

export interface Execution {
  id: number;
  tenantId: number;
  projectId: number;
  userId: number;
  prompt: string;
  llmResponseSummary: string | null;
  gitRepoUrl: string | null;
  baseBranch: string;
  executionBranch: string;
  status: ExecutionStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionPaginatedResponse {
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
  offset: number;
  pageNumber: number;
  pageSize: number;
  content: Execution[];
}

export interface CreateExecutionRequest {
  prompt: string;
}

export interface ExecutionHistoryState {
  executions: Execution[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  loadingMore: boolean;
  creating: boolean;
  error: string | null;
  selectedExecution: Execution | null;
}
