import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecutionHistoryState, Execution, ExecutionPaginatedResponse, CreateExecutionRequest } from '@/types/execution';

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

    // Silent polling (no loading state, no reset)
    pollExecutionsRequest: (state, _action: PayloadAction<{ projectId: string | number }>) => {
      // Don't set loading - this is a silent background refresh
    },
    pollExecutionsSuccess: (state, action: PayloadAction<ExecutionPaginatedResponse>) => {
      // Update data without blinking - only update if there are changes
      state.executions = action.payload.content;
      state.currentPage = action.payload.pageNumber;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
    },
    pollExecutionsFailure: (_state, _action: PayloadAction<string>) => {
      // Silent fail - don't show error for polling
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
  },
});

export const {
  fetchExecutionsRequest,
  fetchExecutionsSuccess,
  fetchExecutionsFailure,
  pollExecutionsRequest,
  pollExecutionsSuccess,
  pollExecutionsFailure,
  fetchMoreExecutionsRequest,
  fetchMoreExecutionsSuccess,
  fetchMoreExecutionsFailure,
  createExecutionRequest,
  createExecutionSuccess,
  createExecutionFailure,
  selectExecution,
  resetExecutions,
} = executionSlice.actions;

export default executionSlice.reducer;
