import { Request, Response } from 'express';
import * as DocumentService from '../services/document.service';
import { processDocument } from '../services/document-processing.service';
import prisma from '../lib/prisma';

export const uploadDocument = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, path: filePath, size, mimetype } = req.file;
    const title = req.body.title || originalname;

    const document = await DocumentService.createDocument(
      user.id,
      title,
      originalname,
      filePath,
      size,
      mimetype
    );

    // Process document synchronously for MVP
    try {
      await processDocument(document.id);
    } catch (processingError) {
      console.error('Document processing failed:', processingError);
      // We don't fail the upload response; we just log it. The client will see processingStatus = FAILED.
    }

    // Fetch the final document state to return to client
    const finalDocument = await prisma.document.findUnique({
      where: { id: document.id }
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and processed',
      data: finalDocument,
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getDocuments = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const documents = await DocumentService.getDocumentsByUser(user.id);
    return res.json({
      success: true,
      message: 'Documents retrieved successfully',
      data: documents,
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    const documentId = req.params.id as string;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await DocumentService.deleteDocument(documentId, user.id);
    return res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    if (error.message === 'Document not found') {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this document' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
