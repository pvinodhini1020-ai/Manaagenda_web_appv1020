import { apiClient } from './authService';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  client_id: string;
  client?: {
    user_id: string;
    name: string;
    email: string;
    company?: string;
  };
  project_id?: string;
  project?: {
    id: string;
    name: string;
    status: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequestRequest {
  title: string;
  description?: string;
  project_id?: string;
}

export interface UpdateServiceRequestRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  project_id?: string;
}

export interface ApproveServiceRequestRequest {
  employee_ids: string[];
}

export interface ServiceRequestListResponse {
  data: ServiceRequest[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

export const serviceRequestService = {
  // Get all service requests (filtered by role)
  getServiceRequests: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
  }): Promise<ServiceRequestListResponse> => {
    const response = await apiClient.get('/service-requests', { params });
    return response.data;
  },

  // Get service request by ID
  getServiceRequestById: async (id: string): Promise<ServiceRequest> => {
    const response = await apiClient.get(`/service-requests/${id}`);
    return response.data.data;
  },

  // Create new service request (client only)
  createServiceRequest: async (request: CreateServiceRequestRequest): Promise<ServiceRequest> => {
    try {
      const response = await apiClient.post('/service-requests', request);
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      console.error('Error creating service request:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create service request');
    }
  },

  // Update service request (admin/employee)
  updateServiceRequest: async (id: string, request: UpdateServiceRequestRequest): Promise<ServiceRequest> => {
    const response = await apiClient.put(`/service-requests/${id}`, request);
    return response.data.data;
  },

  // Delete service request (admin only)
  deleteServiceRequest: async (id: string): Promise<void> => {
    await apiClient.delete(`/service-requests/${id}`);
  },

  // Approve service request and create project (admin only)
  approveServiceRequest: async (id: string, request: ApproveServiceRequestRequest): Promise<ServiceRequest> => {
    const response = await apiClient.post(`/service-requests/${id}/approve`, request);
    return response.data.data;
  },

  // Reject service request (admin only)
  rejectServiceRequest: async (id: string): Promise<void> => {
    await apiClient.post(`/service-requests/${id}/reject`);
  },

  // Get service requests for current client
  getClientServiceRequests: async (clientId: string): Promise<ServiceRequest[]> => {
    const response = await apiClient.get(`/service-requests?client_id=${clientId}`);
    return response.data.data;
  }
};

export default serviceRequestService;
