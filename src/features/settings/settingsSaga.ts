import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import authService from '@/services/authService';
import { UserSettings } from '@/types';
import {
  fetchSettingsRequest,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
} from './settingsSlice';
import { addNotification } from '@/features/notifications/notificationSlice';

// Mock delay
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Worker Sagas
function* fetchSettingsWorker() {
  try {
    // Mock settings fetch
    yield call(mockDelay, 500);
    const settings: UserSettings = {
      theme: 'light',
      language: 'en',
      notifications: true,
      emailUpdates: true,
    };
    yield put(fetchSettingsSuccess(settings));
  } catch (error: any) {
    yield put(fetchSettingsFailure(error.message || 'Failed to fetch settings'));
  }
}

function* updateSettingsWorker(action: PayloadAction<Partial<UserSettings>>) {
  try {
    yield call(mockDelay, 800);
    // Mock updated settings
    const settings: UserSettings = {
      theme: action.payload.theme || 'light',
      language: action.payload.language || 'en',
      notifications: action.payload.notifications ?? true,
      emailUpdates: action.payload.emailUpdates ?? true,
    };
    yield put(updateSettingsSuccess(settings));
    yield put(addNotification({
      type: 'success',
      message: 'Settings updated successfully',
      title: 'Settings Saved',
    }));
  } catch (error: any) {
    yield put(updateSettingsFailure(error.message || 'Failed to update settings'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to update settings',
      title: 'Error',
    }));
  }
}

function* changePasswordWorker(action: PayloadAction<{ currentPassword: string; newPassword: string }>) {
  try {
    yield call(
      authService.changePassword,
      action.payload.currentPassword,
      action.payload.newPassword
    );
    yield put(changePasswordSuccess());
    yield put(addNotification({
      type: 'success',
      message: 'Password changed successfully',
      title: 'Password Updated',
    }));
  } catch (error: any) {
    yield put(changePasswordFailure(error.message || 'Failed to change password'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to change password',
      title: 'Error',
    }));
  }
}

// Watcher Saga
export function* settingsSaga() {
  yield takeLatest(fetchSettingsRequest.type, fetchSettingsWorker);
  yield takeLatest(updateSettingsRequest.type, updateSettingsWorker);
  yield takeLatest(changePasswordRequest.type, changePasswordWorker);
}

export default settingsSaga;
