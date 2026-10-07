import api from './api';

export interface ChatRequest {
  query: string;
  documentId?: string;
  topK?: number;
}

export interface ChatSource {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export const askQuestion = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>('/chat', request);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      const errData = error.response.data;
      if (errData.errors && errData.errors.length > 0) {
        throw new Error(`Validation Error: ${errData.errors[0].message}`);
      }
      throw new Error(errData.message);
    }
    throw new Error('Failed to communicate with the AI service.');
  }
};
