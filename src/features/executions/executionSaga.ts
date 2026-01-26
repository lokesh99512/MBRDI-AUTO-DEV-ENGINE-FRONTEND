import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import executionService from '@/services/executionService';
import { ExecutionPaginatedResponse } from '@/types/execution';
import {
  fetchExecutionsRequest,
  fetchExecutionsSuccess,
  fetchExecutionsFailure,
  fetchMoreExecutionsRequest,
  fetchMoreExecutionsSuccess,
  fetchMoreExecutionsFailure,
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

export function* executionSaga() {
  yield takeLatest(fetchExecutionsRequest.type, handleFetchExecutions);
  yield takeLatest(fetchMoreExecutionsRequest.type, handleFetchMoreExecutions);
}

export default executionSaga;
