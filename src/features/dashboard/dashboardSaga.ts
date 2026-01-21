import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import dashboardService from '@/services/dashboardService';
import { DashboardStats, ActivityItem } from '@/types';
import {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchActivityRequest,
  fetchActivitySuccess,
  fetchActivityFailure,
} from './dashboardSlice';
import { addNotification } from '@/features/notifications/notificationSlice';

// Worker Sagas
function* fetchStatsWorker() {
  try {
    const stats: DashboardStats = yield call(dashboardService.getStats);
    yield put(fetchStatsSuccess(stats));
  } catch (error: any) {
    yield put(fetchStatsFailure(error.message || 'Failed to fetch statistics'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to fetch statistics',
      title: 'Error',
    }));
  }
}

function* fetchActivityWorker(action: PayloadAction<number | undefined>) {
  try {
    const activity: ActivityItem[] = yield call(
      dashboardService.getRecentActivity,
      action.payload || 10
    );
    yield put(fetchActivitySuccess(activity));
  } catch (error: any) {
    yield put(fetchActivityFailure(error.message || 'Failed to fetch activity'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to fetch activity',
      title: 'Error',
    }));
  }
}

// Watcher Saga
export function* dashboardSaga() {
  yield takeLatest(fetchStatsRequest.type, fetchStatsWorker);
  yield takeLatest(fetchActivityRequest.type, fetchActivityWorker);
}

export default dashboardSaga;
