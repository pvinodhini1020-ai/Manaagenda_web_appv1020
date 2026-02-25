import { apiClient } from './authService';

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'employee' | 'client';
  department?: string;
  company?: string;
  address?: string;
  salary?: number;
  status?: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'employee' | 'client';
  department?: string;
  company?: string;
  address?: string;
  salary?: number;
  password?: string;
  status?: string;
}

export interface UserListResponse {
  data: User[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

export const userService = {
  // Get all users (admin only)
  getUsers: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
  }): Promise<UserListResponse> => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to user list');
      }
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to this user profile');
      }
      throw error;
    }
  },

  // Update user profile
  updateUser: async (id: string, user: UpdateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.put(`/users/${id}`, user);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to update this profile');
      }
      throw error;
    }
  },

  // Partial update user profile
  patchUser: async (id: string, user: Partial<UpdateUserRequest>): Promise<User> => {
    try {
      const response = await apiClient.patch(`/users/${id}`, user);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to update this profile');
      }
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied: Only admins can delete users');
      }
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to user profile');
      }
      throw error;
    }
  },

  // Update current user profile
  updateCurrentUser: async (user: UpdateUserRequest): Promise<User> => {
    try {
      const response = await apiClient.put('/users/me', user);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to update profile');
      }
      throw error;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/users/dashboard/stats');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to dashboard statistics');
      }
      throw error;
    }
  }
};

export default userService;
