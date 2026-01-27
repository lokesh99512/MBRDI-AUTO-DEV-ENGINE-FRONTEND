import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import executionService from '@/services/executionService';
import { ExecutionPaginatedResponse, Execution, CreateExecutionRequest } from '@/types/execution';
import {
  fetchExecutionsRequest,
  fetchExecutionsSuccess,
  fetchExecutionsFailure,
  fetchMoreExecutionsRequest,
  fetchMoreExecutionsSuccess,
  fetchMoreExecutionsFailure,
  createExecutionRequest,
  createExecutionSuccess,
  createExecutionFailure,
} from './executionSlice';

function* handleFetchExecutions(action: PayloadAction<{ projectId: string | number }>) {
  try {
    const response: ExecutionPaginatedResponse = yield call(
      executionService.getExecutionHistory,
      action.payload.projectId,
      0,
      25
    );
    yield put(fetchExecutionsSuccess(response));
  } catch (error: any) {
    yield put(fetchExecutionsFailure(error.message || 'Failed to fetch execution history'));
  }
}

function* handleFetchMoreExecutions(action: PayloadAction<{ projectId: string | number; page: number }>) {
  try {
    const response: ExecutionPaginatedResponse = yield call(
      executionService.getExecutionHistory,
      action.payload.projectId,
      action.payload.page,
      25
    );
    yield put(fetchMoreExecutionsSuccess(response));
  } catch (error: any) {
    yield put(fetchMoreExecutionsFailure(error.message || 'Failed to load more executions'));
  }
}

function* handleCreateExecution(action: PayloadAction<{ projectId: string | number; data: CreateExecutionRequest }>) {
  try {
    const response: Execution = yield call(
      executionService.createExecution,
      action.payload.projectId,
      action.payload.data
    );
    yield put(createExecutionSuccess(response));
  } catch (error: any) {
    yield put(createExecutionFailure(error.message || 'Failed to create execution'));
  }
}

export function* executionSaga() {
  yield takeLatest(fetchExecutionsRequest.type, handleFetchExecutions);
  yield takeLatest(fetchMoreExecutionsRequest.type, handleFetchMoreExecutions);
  yield takeLatest(createExecutionRequest.type, handleCreateExecution);
}

export default executionSaga;
