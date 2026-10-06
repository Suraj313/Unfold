import { PrismaClient, DocumentChunk } from '@prisma/client';
import { generateEmbedding } from './embedding.service';
import prisma from '../lib/prisma'; // Assuming this exists, or I will instantiate

export async function processChunkEmbedding(chunkId: string): Promise<boolean> {
  // Find chunk and check if it already has an embedding
  const chunks = await prisma.$queryRaw<{ id: string, text: string, has_embedding: boolean }[]>`
    SELECT id, text, (embedding IS NOT NULL) as has_embedding 
    FROM "DocumentChunk" 
    WHERE id = ${chunkId}::text
    LIMIT 1
  `;

  if (chunks.length === 0) {
    throw new Error('Chunk not found');
  }

  const chunk = chunks[0];

  // Idempotency check
  if (chunk.has_embedding) {
    return false; // Already processed
  }

  // Generate embedding
  const embeddingVector = await generateEmbedding(chunk.text);

  // Store embedding using parameterized query
  const vectorString = `[${embeddingVector.join(',')}]`;
  await prisma.$executeRaw`
    UPDATE "DocumentChunk" 
    SET embedding = ${vectorString}::vector 
    WHERE id = ${chunkId}::text
  `;

  return true;
}

export async function processDocumentEmbeddings(documentId: string): Promise<number> {
  // Find all chunks for this document without embeddings
  const chunks = await prisma.$queryRaw<{ id: string, text: string }[]>`
    SELECT id, text 
    FROM "DocumentChunk" 
    WHERE "documentId" = ${documentId}::text AND embedding IS NULL
  `;

  let processedCount = 0;
  
  for (const chunk of chunks) {
    const embeddingVector = await generateEmbedding(chunk.text);
    const vectorString = `[${embeddingVector.join(',')}]`;
    
    await prisma.$executeRaw`
      UPDATE "DocumentChunk" 
      SET embedding = ${vectorString}::vector 
      WHERE id = ${chunk.id}::text
    `;
    processedCount++;
  }

  return processedCount;
}
