import { Request, Response } from 'express';
import { z } from 'zod';
import { searchSimilarChunks } from '../services/vector-search.service';

const searchSchema = z.object({
  query: z.string().trim().min(1, "Query cannot be empty").max(1000, "Query too long"),
  topK: z.number().int().min(1).max(10).default(5),
  documentId: z.string().uuid("Invalid document ID").optional(),
});

export const searchDocuments = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parseResult = searchSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: parseResult.error.issues,
      });
    }

    const { query, topK, documentId } = parseResult.data;

    const results = await searchSimilarChunks({
      userId: user.id,
      query,
      topK,
      documentId,
    });

    return res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Error during vector search:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
