import prisma from '../lib/prisma';
import fs from 'fs';

export const createDocument = async (
  userId: string,
  title: string,
  originalFileName: string,
  filePath: string,
  fileSize: number,
  mimeType: string
) => {
  try {
    const document = await prisma.document.create({
      data: {
        userId,
        title,
        originalFileName,
        filePath,
        fileSize,
        mimeType,
      },
    });
    return document;
  } catch (error) {
    // Clean up file if database insert fails
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error(`Failed to delete orphaned file ${filePath}:`, unlinkError);
      }
    }
    throw error;
  }
};

export const getDocumentsByUser = async (userId: string) => {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteDocument = async (documentId: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  if (document.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.document.delete({
    where: { id: documentId },
  });

  if (fs.existsSync(document.filePath)) {
    try {
      fs.unlinkSync(document.filePath);
    } catch (error) {
      console.error(`Failed to delete file from filesystem ${document.filePath}:`, error);
    }
  }

  return true;
};
