import api from './api';

export interface Document {
  id: string;
  userId: string;
  title: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get<ApiResponse<Document[]>>('/documents');
  return response.data.data;
};

export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<ApiResponse<Document>>('/documents', formData);
  return response.data.data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/documents/${documentId}`);
};
