import axios from 'axios';
import type {
  AuthResponse,
  User,
  Document,
  DocumentListResponse,
  DocumentStats,
  Conversation,
  ConversationListResponse,
  ConversationDetail,
  ChatResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return res.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
    const res = await api.put<User>('/auth/profile', data);
    return res.data;
  },
  changePassword: async (current_password: string, new_password: string): Promise<void> => {
    await api.post('/auth/change-password', { current_password, new_password });
  },
};

export const documentApi = {
  upload: async (file: File, onProgress?: (percent: number) => void): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  list: async (params?: {
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    offset?: number;
  }): Promise<DocumentListResponse> => {
    const res = await api.get<DocumentListResponse>('/documents', { params });
    return res.data;
  },

  getStats: async (): Promise<DocumentStats> => {
    const res = await api.get<DocumentStats>('/documents/stats');
    return res.data;
  },

  get: async (id: string): Promise<Document> => {
    const res = await api.get<Document>(`/documents/${id}`);
    return res.data;
  },

  getStatus: async (id: string): Promise<{ id: string; status: string; page_count?: number; processing_error?: string }> => {
    const res = await api.get(`/documents/${id}/status`);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};

export const chatApi = {
  createConversation: async (data?: { title?: string; document_ids?: string[] }): Promise<Conversation> => {
    const res = await api.post<Conversation>('/chat/conversations', data || {});
    return res.data;
  },

  listConversations: async (limit = 50, offset = 0): Promise<ConversationListResponse> => {
    const res = await api.get<ConversationListResponse>('/chat/conversations', {
      params: { limit, offset },
    });
    return res.data;
  },

  getConversation: async (id: string): Promise<ConversationDetail> => {
    const res = await api.get<ConversationDetail>(`/chat/conversations/${id}`);
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<ChatResponse> => {
    const res = await api.post<ChatResponse>(`/chat/conversations/${conversationId}/messages`, {
      content,
    });
    return res.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/chat/conversations/${id}`);
  },
};

export default api;
