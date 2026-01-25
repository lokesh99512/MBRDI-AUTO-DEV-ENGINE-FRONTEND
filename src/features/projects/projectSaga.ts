import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import projectService from '@/services/projectService';
import { Project, CreateProjectPayload, GenerationOutput, ProjectFilters, PaginatedResponse, UpdateProjectPayload } from '@/types';
import {
  fetchProjectsRequest,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  fetchProjectRequest,
  fetchProjectSuccess,
  fetchProjectFailure,
  createProjectRequest,
  createProjectSuccess,
  createProjectFailure,
  generateOutputRequest,
  generateOutputSuccess,
  generateOutputFailure,
  regenerateProjectRequest,
  regenerateProjectSuccess,
  regenerateProjectFailure,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailure,
} from './projectSlice';
import { addNotification } from '@/features/notifications/notificationSlice';

// Worker Sagas
function* fetchProjectsWorker(action: PayloadAction<ProjectFilters>) {
  try {
    const response: PaginatedResponse<Project> = yield call(
      projectService.getProjects,
      action.payload
    );
    yield put(fetchProjectsSuccess(response.data));
  } catch (error: any) {
    yield put(fetchProjectsFailure(error.message || 'Failed to fetch projects'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to fetch projects',
      title: 'Error',
    }));
  }
}

function* fetchProjectWorker(action: PayloadAction<string>) {
  try {
    const project: Project = yield call(projectService.getProject, action.payload);
    yield put(fetchProjectSuccess(project));
  } catch (error: any) {
    yield put(fetchProjectFailure(error.message || 'Failed to fetch project'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to fetch project',
      title: 'Error',
    }));
  }
}

function* createProjectWorker(action: PayloadAction<CreateProjectPayload>) {
  try {
    const project: Project = yield call(projectService.createProject, action.payload);
    yield put(createProjectSuccess(project));
    yield put(addNotification({
      type: 'success',
      message: `Project "${project.name}" created successfully`,
      title: 'Project Created',
    }));
  } catch (error: any) {
    yield put(createProjectFailure(error.message || 'Failed to create project'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to create project',
      title: 'Error',
    }));
  }
}

function* generateOutputWorker(action: PayloadAction<string>) {
  try {
    const output: GenerationOutput = yield call(projectService.generateOutput, action.payload);
    yield put(generateOutputSuccess({ projectId: action.payload, output }));
    yield put(addNotification({
      type: 'success',
      message: 'AI generation completed successfully',
      title: 'Generation Complete',
    }));
  } catch (error: any) {
    yield put(generateOutputFailure(error.message || 'Failed to generate output'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to generate output',
      title: 'Generation Error',
    }));
  }
}

function* regenerateProjectWorker(action: PayloadAction<{ projectId: string; description?: string }>) {
  try {
    const project: Project = yield call(
      projectService.regenerateProject,
      action.payload.projectId,
      action.payload.description
    );
    yield put(regenerateProjectSuccess(project));
    yield put(addNotification({
      type: 'success',
      message: 'Project regenerated successfully',
      title: 'Regeneration Complete',
    }));
  } catch (error: any) {
    yield put(regenerateProjectFailure(error.message || 'Failed to regenerate project'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to regenerate project',
      title: 'Error',
    }));
  }
}

function* updateProjectWorker(action: PayloadAction<{ id: string; data: Partial<Project> }>) {
  try {
    const payload: UpdateProjectPayload = { id: action.payload.id, ...action.payload.data };
    const project: Project = yield call(projectService.updateProject, payload);
    yield put(updateProjectSuccess(project));
    yield put(addNotification({
      type: 'success',
      message: 'Project updated successfully',
      title: 'Project Updated',
    }));
  } catch (error: any) {
    yield put(updateProjectFailure(error.message || 'Failed to update project'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to update project',
      title: 'Error',
    }));
  }
}

function* deleteProjectWorker(action: PayloadAction<string>) {
  try {
    yield call(projectService.deleteProject, action.payload);
    yield put(deleteProjectSuccess(action.payload));
    yield put(addNotification({
      type: 'success',
      message: 'Project deleted successfully',
      title: 'Project Deleted',
    }));
  } catch (error: any) {
    yield put(deleteProjectFailure(error.message || 'Failed to delete project'));
    yield put(addNotification({
      type: 'error',
      message: error.message || 'Failed to delete project',
      title: 'Error',
    }));
  }
}

// Watcher Saga
export function* projectSaga() {
  yield takeLatest(fetchProjectsRequest.type, fetchProjectsWorker);
  yield takeLatest(fetchProjectRequest.type, fetchProjectWorker);
  yield takeLatest(createProjectRequest.type, createProjectWorker);
  yield takeLatest(generateOutputRequest.type, generateOutputWorker);
  yield takeLatest(regenerateProjectRequest.type, regenerateProjectWorker);
  yield takeLatest(updateProjectRequest.type, updateProjectWorker);
  yield takeLatest(deleteProjectRequest.type, deleteProjectWorker);
}

export default projectSaga;
