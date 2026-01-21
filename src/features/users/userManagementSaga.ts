import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import userService from '@/services/userService';
import { User } from '@/types';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRoleRequest,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from './userManagementSlice';
import { addNotification } from '@/features/notifications/notificationSlice';

// Worker Sagas
function* fetchUsersWorker() {
  try {
    const users: User[] = yield call(userService.getUsers);
    yield put(fetchUsersSuccess(users));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.message || 'Failed to fetch users'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to fetch users',
      title: 'Error',
    }));
  }
}

function* createUserWorker(action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) {
  try {
    const user: User = yield call(userService.createUser, action.payload);
    yield put(createUserSuccess(user));
    yield put(addNotification({
      type: 'success',
      message: `User "${user.email}" created successfully`,
      title: 'User Created',
    }));
  } catch (error: any) {
    yield put(createUserFailure(error.message || 'Failed to create user'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to create user',
      title: 'Error',
    }));
  }
}

function* updateUserRoleWorker(action: PayloadAction<{ id: string; role: User['role'] }>) {
  try {
    const user: User = yield call(
      userService.updateUserRole,
      action.payload.id,
      action.payload.role
    );
    yield put(updateUserRoleSuccess(user));
    yield put(addNotification({
      type: 'success',
      message: 'User role updated successfully',
      title: 'Role Updated',
    }));
  } catch (error: any) {
    yield put(updateUserRoleFailure(error.message || 'Failed to update role'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to update role',
      title: 'Error',
    }));
  }
}

function* deleteUserWorker(action: PayloadAction<string>) {
  try {
    yield call(userService.deleteUser, action.payload);
    yield put(deleteUserSuccess(action.payload));
    yield put(addNotification({
      type: 'success',
      message: 'User deleted successfully',
      title: 'User Deleted',
    }));
  } catch (error: any) {
    yield put(deleteUserFailure(error.message || 'Failed to delete user'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to delete user',
      title: 'Error',
    }));
  }
}

// Watcher Saga
export function* userManagementSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersWorker);
  yield takeLatest(createUserRequest.type, createUserWorker);
  yield takeLatest(updateUserRoleRequest.type, updateUserRoleWorker);
  yield takeLatest(deleteUserRequest.type, deleteUserWorker);
}

export default userManagementSaga;
