import { apiClient } from './authService';

export interface Project {
  id: string;
  name: string;
  description: string;
  client_id: string;
  client?: {
    user_id: string;
    name: string;
    email: string;
    company?: string;
  };
  status: 'active' | 'pending' | 'completed' | 'rejected' | 'in_progress';
  employee_ids: string[];
  employees?: Array<{
    user_id: string;
    name: string;
    email: string;
    department?: string;
  }>;
  created_at: string;
  updated_at: string;
  progress?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  client_id: string;
  status?: 'active' | 'pending' | 'completed' | 'in_progress';
  employee_ids?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'rejected' | 'in_progress';
}

export interface UpdateProjectProgressRequest {
  progress: number;
}

export interface AssignEmployeesRequest {
  employee_ids: string[];
}

export interface ProjectListResponse {
  data: Project[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

export const projectService = {
  // Get all projects (filtered by role)
  getProjects: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
  }): Promise<ProjectListResponse> => {
    try {
      const response = await apiClient.get('/projects', { params });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied to projects');
      }
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<Project> => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied to this project');
      }
      throw error;
    }
  },

  // Create new project (admin only)
  createProject: async (project: CreateProjectRequest): Promise<Project> => {
    try {
      const response = await apiClient.post('/projects', project);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied: Only admins can create projects');
      }
      throw error;
    }
  },

  // Update project (admin/employee with restrictions)
  updateProject: async (id: string, project: UpdateProjectRequest): Promise<Project> => {
    try {
      const response = await apiClient.put(`/projects/${id}`, project);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied to update this project');
      }
      throw error;
    }
  },

  // Delete project (admin only)
  deleteProject: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied: Only admins can delete projects');
      }
      throw error;
    }
  },

  // Assign employees to project (admin only)
  assignEmployees: async (id: string, employees: AssignEmployeesRequest): Promise<void> => {
    try {
      await apiClient.post(`/projects/${id}/assign`, employees);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied: Only admins can assign employees');
      }
      throw error;
    }
  },

  // Get projects for current client
  getClientProjects: async (clientId: string): Promise<Project[]> => {
    try {
      const response = await apiClient.get(`/projects?client_id=${clientId}`);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied to client projects');
      }
      throw error;
    }
  },

  // Update project progress
  updateProgress: async (id: string, progress: number): Promise<Project> => {
    try {
      const response = await apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 403) {
        const errorData = error.response as { data?: { message?: string } };
        throw new Error(errorData.data?.message || 'Access denied to update project progress');
      }
      throw error;
    }
  }
};

export default projectService;
