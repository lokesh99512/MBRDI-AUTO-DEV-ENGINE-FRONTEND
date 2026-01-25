import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project, CreateProjectPayload, GenerationOutput, ProjectFilters } from '@/types';

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  generating: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Fetch projects
    fetchProjectsRequest: (state, action: PayloadAction<ProjectFilters>) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action: PayloadAction<Project[]>) => {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single project
    fetchProjectRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectSuccess: (state, action: PayloadAction<Project>) => {
      state.loading = false;
      state.currentProject = action.payload;
    },
    fetchProjectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create project
    createProjectRequest: (state, action: PayloadAction<CreateProjectPayload>) => {
      state.loading = true;
      state.error = null;
    },
    createProjectSuccess: (state, action: PayloadAction<Project>) => {
      state.loading = false;
      state.projects.unshift(action.payload);
      state.currentProject = action.payload;
    },
    createProjectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Generate output
    generateOutputRequest: (state, action: PayloadAction<string>) => {
      state.generating = true;
      state.error = null;
    },
    generateOutputSuccess: (state, action: PayloadAction<{ projectId: string; output: GenerationOutput }>) => {
      state.generating = false;
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.output = action.payload.output;
        state.currentProject.status = 'completed';
      }
      const projectIndex = state.projects.findIndex(p => p.id === action.payload.projectId);
      if (projectIndex > -1) {
        state.projects[projectIndex].output = action.payload.output;
        state.projects[projectIndex].status = 'completed';
      }
    },
    generateOutputFailure: (state, action: PayloadAction<string>) => {
      state.generating = false;
      state.error = action.payload;
    },

    // Regenerate project
    regenerateProjectRequest: (state, action: PayloadAction<{ projectId: string; description?: string }>) => {
      state.generating = true;
      state.error = null;
    },
    regenerateProjectSuccess: (state, action: PayloadAction<Project>) => {
      state.generating = false;
      state.currentProject = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === action.payload.id);
      if (projectIndex > -1) {
        state.projects[projectIndex] = action.payload;
      }
    },
    regenerateProjectFailure: (state, action: PayloadAction<string>) => {
      state.generating = false;
      state.error = action.payload;
    },

    // Update project
    updateProjectRequest: (state, action: PayloadAction<{ id: string; data: Partial<Project> }>) => {
      state.loading = true;
      state.error = null;
    },
    updateProjectSuccess: (state, action: PayloadAction<Project>) => {
      state.loading = false;
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx > -1) state.projects[idx] = action.payload;
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload;
      }
    },
    updateProjectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete project
    deleteProjectRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteProjectSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    deleteProjectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Clear current project
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },

    // Clear error
    clearProjectError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearCurrentProject,
  clearProjectError,
} = projectSlice.actions;

export default projectSlice.reducer;
