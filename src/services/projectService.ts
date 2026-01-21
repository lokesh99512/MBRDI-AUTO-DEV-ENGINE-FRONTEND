import { api } from './api';
import { 
  Project, 
  CreateProjectPayload, 
  GenerationOutput, 
  ProjectFilters,
  PaginatedResponse 
} from '@/types';

// Mock delay to simulate API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock projects data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    type: 'fullstack',
    technologies: ['react', 'node', 'python'],
    description: 'Complete e-commerce solution with payment integration',
    status: 'completed',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T12:30:00Z',
    createdBy: '1',
    output: {
      uiDesign: '// UI Design specifications...',
      frontendCode: '// React frontend code...',
      backendCode: '// Node.js backend code...',
      apiEndpoints: '// API endpoint definitions...',
      databaseSchema: '// PostgreSQL schema...',
      documentation: '# Project Documentation...',
    },
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    type: 'web',
    technologies: ['react', 'python'],
    description: 'Real-time analytics dashboard with data visualization',
    status: 'completed',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Notification Service',
    type: 'microservice',
    technologies: ['node', 'go'],
    description: 'Scalable notification microservice for push and email',
    status: 'generating',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
    createdBy: '2',
  },
  {
    id: '4',
    name: 'User Management API',
    type: 'microservice',
    technologies: ['java', 'dotnet'],
    description: 'Enterprise user management with SSO integration',
    status: 'pending',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    createdBy: '1',
  },
];

// Mock generation output
const generateMockOutput = (projectName: string): GenerationOutput => ({
  uiDesign: `
/* =========================================
   UI DESIGN - ${projectName}
   ========================================= */

## Layout Structure
- Header with navigation
- Sidebar with menu items
- Main content area with cards
- Footer with links

## Color Palette
- Primary: #0d6efd
- Secondary: #6c757d
- Success: #198754
- Danger: #dc3545

## Typography
- Font Family: 'Segoe UI', system-ui
- Headings: Bold, 1.5rem - 2.5rem
- Body: Regular, 1rem
`,
  frontendCode: `
// =========================================
// FRONTEND CODE - ${projectName}
// =========================================

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface DashboardProps {
  title: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ title }) => {
  return (
    <Container fluid>
      <h1>{title}</h1>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Statistics</Card.Title>
              <Card.Text>View your project statistics</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
`,
  backendCode: `
// =========================================
// BACKEND CODE - ${projectName}
// =========================================

import express from 'express';
import { Router } from 'express';

const router = Router();

// GET /api/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectService.findAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/projects
router.post('/projects', async (req, res) => {
  try {
    const project = await ProjectService.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
`,
  apiEndpoints: `
# =========================================
# API ENDPOINTS - ${projectName}
# =========================================

## Authentication
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
POST   /api/auth/refresh        # Refresh token
GET    /api/auth/me             # Get current user

## Projects
GET    /api/projects            # List all projects
POST   /api/projects            # Create new project
GET    /api/projects/:id        # Get project by ID
PUT    /api/projects/:id        # Update project
DELETE /api/projects/:id        # Delete project

## Generation
POST   /api/generate            # Start AI generation
GET    /api/generate/:id/status # Check generation status
GET    /api/generate/:id/output # Get generation output
`,
  databaseSchema: `
-- =========================================
-- DATABASE SCHEMA - ${projectName}
-- =========================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  technologies TEXT[],
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation outputs table
CREATE TABLE generation_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  ui_design TEXT,
  frontend_code TEXT,
  backend_code TEXT,
  api_endpoints TEXT,
  database_schema TEXT,
  documentation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,
  documentation: `
# ${projectName} Documentation

## Overview
This project was generated using the AI-powered code generation platform.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL

## API Reference
See the API Endpoints tab for full API documentation.

## Deployment
\`\`\`bash
npm run build
npm run start:prod
\`\`\`
`,
});

export const projectService = {
  // Get all projects with pagination and filters
  getProjects: async (filters: ProjectFilters): Promise<PaginatedResponse<Project>> => {
    try {
      const response = await api.get<PaginatedResponse<Project>>('/projects', { params: filters });
      return response.data;
    } catch (error) {
      await mockDelay(800);
      
      let filtered = [...mockProjects];
      
      if (filters.search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      if (filters.status) {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      const paginated = filtered.slice(start, end);
      
      return {
        data: paginated,
        total: filtered.length,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.ceil(filtered.length / filters.pageSize),
      };
    }
  },

  // Get single project by ID
  getProject: async (id: string): Promise<Project> => {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error) {
      await mockDelay(500);
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      return { ...project, output: generateMockOutput(project.name) };
    }
  },

  // Create new project
  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    try {
      const response = await api.post<Project>('/projects', data);
      return response.data;
    } catch (error) {
      await mockDelay(1000);
      const newProject: Project = {
        id: String(mockProjects.length + 1),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '1',
      };
      mockProjects.unshift(newProject);
      return newProject;
    }
  },

  // Generate AI output for project
  generateOutput: async (projectId: string): Promise<GenerationOutput> => {
    try {
      const response = await api.post<GenerationOutput>(`/projects/${projectId}/generate`);
      return response.data;
    } catch (error) {
      // Simulate generation with progress
      await mockDelay(3000);
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const output = generateMockOutput(project.name);
      project.output = output;
      project.status = 'completed';
      return output;
    }
  },

  // Re-generate project output
  regenerateProject: async (projectId: string, description?: string): Promise<Project> => {
    try {
      const response = await api.post<Project>(`/projects/${projectId}/regenerate`, { description });
      return response.data;
    } catch (error) {
      await mockDelay(2500);
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      project.output = generateMockOutput(project.name);
      project.updatedAt = new Date().toISOString();
      return project;
    }
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      await mockDelay(500);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index > -1) mockProjects.splice(index, 1);
    }
  },
};

export default projectService;
