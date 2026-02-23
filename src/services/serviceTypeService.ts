import { apiClient } from './authService';

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateServiceTypeRequest {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface UpdateServiceTypeRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export const serviceTypeService = {
  // Get all service types (with optional status filter)
  getServiceTypes: async (status?: string): Promise<ServiceType[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/service-types', { params });
    return response.data.data;
  },

  // Get only active service types (for client dropdown)
  getActiveServiceTypes: async (): Promise<ServiceType[]> => {
    try {
      const response = await apiClient.get('/service-types?status=active');
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching active service types:', error);
      throw error;
    }
  },

  // Get service type by ID
  getServiceTypeById: async (id: string): Promise<ServiceType> => {
    const response = await apiClient.get(`/service-types/${id}`);
    return response.data.data;
  },

  // Create new service type (admin only)
  createServiceType: async (request: CreateServiceTypeRequest): Promise<ServiceType> => {
    const response = await apiClient.post('/service-types', request);
    return response.data.data;
  },

  // Update service type (admin only)
  updateServiceType: async (id: string, request: UpdateServiceTypeRequest): Promise<ServiceType> => {
    const response = await apiClient.put(`/service-types/${id}`, request);
    return response.data.data;
  },

  // Delete service type (admin only)
  deleteServiceType: async (id: string): Promise<void> => {
    await apiClient.delete(`/service-types/${id}`);
  }
};

export default serviceTypeService;
