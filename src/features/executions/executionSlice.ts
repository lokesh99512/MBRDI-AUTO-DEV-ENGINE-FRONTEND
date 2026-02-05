 import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 import { ExecutionHistoryState, Execution, ExecutionPaginatedResponse, CreateExecutionRequest, StreamMessage } from '@/types/execution';

const initialState: ExecutionHistoryState = {
  executions: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  loadingMore: false,
  creating: false,
  error: null,
  selectedExecution: null,
   streamingExecutionId: null,
   streamingMessages: [],
   isStreaming: false,
};

const executionSlice = createSlice({
  name: 'executions',
  initialState,
  reducers: {
    // Fetch initial page
    fetchExecutionsRequest: (state, _action: PayloadAction<{ projectId: string | number }>) => {
      state.loading = true;
      state.error = null;
      state.executions = [];
      state.currentPage = 0;
      state.totalPages = 0;
    },
    fetchExecutionsSuccess: (state, action: PayloadAction<ExecutionPaginatedResponse>) => {
      state.loading = false;
      state.executions = action.payload.content;
      state.currentPage = action.payload.pageNumber;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
    },
    fetchExecutionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch next page (infinite scroll)
    fetchMoreExecutionsRequest: (state, _action: PayloadAction<{ projectId: string | number; page: number }>) => {
      state.loadingMore = true;
      state.error = null;
    },
    fetchMoreExecutionsSuccess: (state, action: PayloadAction<ExecutionPaginatedResponse>) => {
      state.loadingMore = false;
      state.executions = [...state.executions, ...action.payload.content];
      state.currentPage = action.payload.pageNumber;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
    },
    fetchMoreExecutionsFailure: (state, action: PayloadAction<string>) => {
      state.loadingMore = false;
      state.error = action.payload;
    },

    // Create new execution
    createExecutionRequest: (state, _action: PayloadAction<{ projectId: string | number; data: CreateExecutionRequest }>) => {
      state.creating = true;
      state.error = null;
    },
    createExecutionSuccess: (state, action: PayloadAction<Execution>) => {
      state.creating = false;
      state.executions = [action.payload, ...state.executions];
      state.totalElements += 1;
    },
    createExecutionFailure: (state, action: PayloadAction<string>) => {
      state.creating = false;
      state.error = action.payload;
    },

    // Select execution for detail panel
    selectExecution: (state, action: PayloadAction<Execution | null>) => {
      state.selectedExecution = action.payload;
    },

    // Reset state
    resetExecutions: () => initialState,
     
     // SSE Streaming actions
     startStreaming: (state, action: PayloadAction<{ executionId: number }>) => {
       state.streamingExecutionId = action.payload.executionId;
       state.streamingMessages = [];
       state.isStreaming = true;
     },
     addStreamMessage: (state, action: PayloadAction<StreamMessage>) => {
       state.streamingMessages.push(action.payload);
     },
     stopStreaming: (state) => {
       state.isStreaming = false;
       state.streamingExecutionId = null;
     },
     clearStreamMessages: (state) => {
       state.streamingMessages = [];
     },
     // Update execution status when streaming completes
     updateExecutionStatus: (state, action: PayloadAction<{ executionId: number; status: 'COMPLETED' | 'FAILED'; llmResponseSummary?: string }>) => {
       const execution = state.executions.find(e => e.id === action.payload.executionId);
       if (execution) {
         execution.status = action.payload.status;
         if (action.payload.llmResponseSummary) {
           execution.llmResponseSummary = action.payload.llmResponseSummary;
         }
       }
     },
  },
});

export const {
  fetchExecutionsRequest,
  fetchExecutionsSuccess,
  fetchExecutionsFailure,
  fetchMoreExecutionsRequest,
  fetchMoreExecutionsSuccess,
  fetchMoreExecutionsFailure,
  createExecutionRequest,
  createExecutionSuccess,
  createExecutionFailure,
  selectExecution,
  resetExecutions,
   startStreaming,
   addStreamMessage,
   stopStreaming,
   clearStreamMessages,
   updateExecutionStatus,
} = executionSlice.actions;

export default executionSlice.reducer;
