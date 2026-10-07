import { Request, Response } from 'express';
import { z } from 'zod';
import { generateQuiz } from '../services/practice.service';

const generateQuizSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
});

export const handleGenerateQuiz = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parseResult = generateQuizSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: parseResult.error.issues,
      });
    }

    const { documentId } = parseResult.data;

    const quiz = await generateQuiz({
      userId: user.id,
      documentId,
    });

    return res.status(200).json(quiz);
  } catch (error: any) {
    console.error('Error during practice quiz generation:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error.message.includes('Document not found') || error.message.includes('extractable content') || error.message.includes('hallucinated')) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: 'Internal server error during quiz generation.' });
  }
};
