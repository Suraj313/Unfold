import { Request, Response } from 'express';
import { z } from 'zod';
import { answerQuestion } from '../services/rag.service';

const chatSchema = z.object({
  query: z.string().trim().min(1, "Query cannot be empty").max(1000, "Query too long"),
  topK: z.number().int().min(1).max(10).default(5).optional(),
  documentId: z.string().uuid("Invalid document ID").optional(),
});

export const handleChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: parseResult.error.issues,
      });
    }

    const { query, topK, documentId } = parseResult.data;

    const result = await answerQuestion({
      userId: user.id,
      query,
      topK,
      documentId,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error during chat RAG API:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
