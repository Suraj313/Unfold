import { Router } from 'express';
import { searchDocuments } from '../controllers/search.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, searchDocuments);

export default router;
