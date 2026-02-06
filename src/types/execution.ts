 // Execution History Types

 export type ExecutionStatus =  "CREATED"    | "CLONING_REPO"  | "ANALYZING_CODE"  | "CALLING_LLM" | "APPLYING_CHANGES"  | "COMMITTING"   |"COMPLETED"  | "FAILED" ;

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
  projectId: number;
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
 
   // SSE Streaming state
   streamingExecutionId: number | null;
   streamingMessages: StreamMessage[];
   isStreaming: boolean;
 }
 
 export interface StreamMessage {
   id: string;
   executionId: number;
   message: string;
   timestamp: string;
 }
