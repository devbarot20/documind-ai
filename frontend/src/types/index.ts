export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  page_count?: number;
  processing_error?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  total: number;
  processing: number;
  completed: number;
  failed: number;
  total_size: number;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
}

export interface SourceCitation {
  citation_number: number;
  document_name: string;
  document_id: string;
  page_number?: number;
  excerpt: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  document_ids?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface ChatResponse {
  user_message: Message;
  assistant_message: Message;
}
