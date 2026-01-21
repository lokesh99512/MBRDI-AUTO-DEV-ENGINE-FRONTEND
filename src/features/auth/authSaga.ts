import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import authService from '@/services/authService';
import { User, LoginResponse } from '@/types';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from './authSlice';
import { addNotification } from '@/features/notifications/notificationSlice';

// Worker Sagas
function* loginWorker(action: PayloadAction<{ email: string; password: string; rememberMe?: boolean }>) {
  try {
    const response: LoginResponse = yield call(
      authService.login,
      action.payload
    );
    yield put(loginSuccess({ user: response.user, token: response.token }));
    yield put(addNotification({
      type: 'success',
      message: 'Login successful!',
      title: 'Welcome back',
    }));
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Login failed'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Login failed',
      title: 'Authentication Error',
    }));
  }
}

function* logoutWorker() {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());
    yield put(addNotification({
      type: 'info',
      message: 'You have been logged out',
      title: 'Logged Out',
    }));
  } catch (error: any) {
    // Still logout locally even if API fails
    yield put(logoutSuccess());
  }
}

function* getCurrentUserWorker() {
  try {
    const user: User = yield call(authService.getCurrentUser);
    yield put(getCurrentUserSuccess(user));
  } catch (error: any) {
    yield put(getCurrentUserFailure(error.message || 'Failed to get user'));
  }
}

function* updateProfileWorker(action: PayloadAction<Partial<User>>) {
  try {
    const user: User = yield call(authService.updateProfile, action.payload);
    yield put(updateProfileSuccess(user));
    yield put(addNotification({
      type: 'success',
      message: 'Profile updated successfully',
      title: 'Profile Updated',
    }));
  } catch (error: any) {
    yield put(updateProfileFailure(error.message || 'Failed to update profile'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to update profile',
      title: 'Update Error',
    }));
  }
}

// Watcher Saga
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(logoutRequest.type, logoutWorker);
  yield takeLatest(getCurrentUserRequest.type, getCurrentUserWorker);
  yield takeLatest(updateProfileRequest.type, updateProfileWorker);
}

export default authSaga;
