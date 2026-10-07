import api from './api';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sourcePageNumber: number;
}

export interface GenerateQuizResponse {
  questions: QuizQuestion[];
}

export const generateQuiz = async (documentId: string): Promise<GenerateQuizResponse> => {
  try {
    const response = await api.post<GenerateQuizResponse>('/practice/generate', { documentId });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      const errData = error.response.data;
      if (errData.errors && errData.errors.length > 0) {
        throw new Error(`Validation Error: ${errData.errors[0].message}`);
      }
      throw new Error(errData.message);
    }
    throw new Error('Failed to generate quiz. Please try again.');
  }
};
