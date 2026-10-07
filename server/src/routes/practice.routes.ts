import { Router } from 'express';
import { handleGenerateQuiz } from '../controllers/practice.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', requireAuth, handleGenerateQuiz);

export default router;
