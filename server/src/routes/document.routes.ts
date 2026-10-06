import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/document.controller';
import { uploadDocument as uploadMiddleware } from '../middleware/upload.middleware';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const uploadHandler = (req: any, res: any, next: any) => {
  const upload = uploadMiddleware.single('file');
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    next();
  });
};

router.post('/', requireAuth, uploadHandler, uploadDocument);
router.get('/', requireAuth, getDocuments);
router.delete('/:id', requireAuth, deleteDocument);

export default router;
