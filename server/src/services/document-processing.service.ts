import { DocumentProcessingStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { extractPdfText } from './pdf-extraction.service';
import { chunkDocumentPages } from './document-chunking.service';
import { processDocumentEmbeddings } from './chunk-embedding.service';
import * as StorageService from './storage.service';
import path from 'path';
import fs from 'fs';

export async function processDocument(documentId: string, localFilePathOverride?: string): Promise<void> {
  // 1. Load the Document
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // 2. Set status to PROCESSING
  await prisma.document.update({
    where: { id: documentId },
    data: { 
      processingStatus: DocumentProcessingStatus.PROCESSING,
      processingError: null
    },
  });

  try {
    // 3. Determine if chunks already exist
    const chunkCount = await prisma.documentChunk.count({
      where: { documentId: document.id }
    });

    if (chunkCount === 0) {
      // PDF Extraction & Chunking Phase
      
      const filePath = localFilePathOverride || await StorageService.downloadToTemp(document.filePath);

      try {
        const extractedDocument = await extractPdfText(filePath);
        
        const chunks = chunkDocumentPages(document.id, extractedDocument.pages);

        if (chunks.length > 0) {
          // Persist chunks atomically to prevent partial creation on crash
          await prisma.$transaction([
            prisma.documentChunk.createMany({
              data: chunks.map(chunk => ({
                documentId: chunk.documentId,
                pageNumber: chunk.pageNumber,
                chunkIndex: chunk.chunkIndex,
                text: chunk.text
              }))
            })
          ]);
        }
      } finally {
        if (!localFilePathOverride) {
           // We downloaded a temporary file, clean it up
           if (fs.existsSync(filePath)) {
             try { fs.unlinkSync(filePath); } catch (e) { console.error('Failed to cleanup temp file', e); }
           }
        }
      }
    }

    // 4. Generate & persist embeddings for chunks without them
    await processDocumentEmbeddings(document.id);

    // 5. Mark as READY
    await prisma.document.update({
      where: { id: documentId },
      data: {
        processingStatus: DocumentProcessingStatus.READY,
        processingError: null
      }
    });

  } catch (error: any) {
    // 6. Mark as FAILED on error
    const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
    
    await prisma.document.update({
      where: { id: documentId },
      data: {
        processingStatus: DocumentProcessingStatus.FAILED,
        processingError: errorMessage
      }
    });

    throw error;
  }
}
