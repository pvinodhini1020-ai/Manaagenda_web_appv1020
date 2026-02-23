import { apiClient } from './authService';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  project_id: string;
  project?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateMessageRequest {
  content: string;
  project_id: string;
}

export interface MessageListResponse {
  data: Message[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

export const messageService = {
  // Get all messages
  getMessages: async (params?: {
    page?: number;
    page_size?: number;
    project_id?: string;
  }): Promise<MessageListResponse> => {
    try {
      const response = await apiClient.get('/messages', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to messages');
      }
      throw error;
    }
  },

  // Get message by ID
  getMessageById: async (id: string): Promise<Message> => {
    try {
      const response = await apiClient.get(`/messages/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to this message');
      }
      throw error;
    }
  },

  // Create new message
  createMessage: async (message: CreateMessageRequest): Promise<Message> => {
    try {
      const response = await apiClient.post('/messages', message);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to send messages');
      }
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/messages/${id}`);
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to delete this message');
      }
      throw error;
    }
  },

  // Get messages for a specific project
  getProjectMessages: async (projectId: string): Promise<Message[]> => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/messages`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Access denied to project messages');
      }
      throw error;
    }
  }
};

export default messageService;
