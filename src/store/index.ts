import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// Import reducers
import authReducer from '@/features/auth/authSlice';
import projectReducer from '@/features/projects/projectSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import userManagementReducer from '@/features/users/userManagementSlice';
import settingsReducer from '@/features/settings/settingsSlice';
import notificationReducer from '@/features/notifications/notificationSlice';
import executionReducer from '@/features/executions/executionSlice';

// Import sagas
import { authSaga } from '@/features/auth/authSaga';
import { projectSaga } from '@/features/projects/projectSaga';
import { dashboardSaga } from '@/features/dashboard/dashboardSaga';
import { userManagementSaga } from '@/features/users/userManagementSaga';
import { settingsSaga } from '@/features/settings/settingsSaga';
import { executionSaga } from '@/features/executions/executionSaga';

// Root Saga
function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(projectSaga),
    fork(dashboardSaga),
    fork(userManagementSaga),
    fork(settingsSaga),
    fork(executionSaga),
  ]);
}

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store with combined reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    dashboard: dashboardReducer,
    userManagement: userManagementReducer,
    settings: settingsReducer,
    notifications: notificationReducer,
    executions: executionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
