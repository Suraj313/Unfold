import prisma from '../lib/prisma';
import { generateEmbedding } from './embedding.service';
import { Prisma } from '@prisma/client';

export interface SearchOptions {
  userId: string;
  query: string;
  topK?: number;
  documentId?: string;
}

export interface SearchResult {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  similarity: number;
}

export async function searchSimilarChunks({
  userId,
  query,
  topK = 5,
  documentId,
}: SearchOptions): Promise<SearchResult[]> {
  // 1. Generate query embedding
  const queryVector = await generateEmbedding(query);
  const vectorString = `[${queryVector.join(',')}]`;

  // 2. Build the query parts securely with Prisma.sql
  // Always restrict to the current user's READY documents
  let baseQuery = Prisma.sql`
    SELECT
        dc.id AS "chunkId",
        dc."documentId",
        d.title AS "documentTitle",
        dc."pageNumber",
        dc."chunkIndex",
        dc.text,
        1 - (dc.embedding <=> ${vectorString}::vector) AS similarity
    FROM "DocumentChunk" dc
    JOIN "Document" d
        ON d.id = dc."documentId"
    WHERE d."userId" = ${userId}
      AND d."processingStatus" = 'READY'
      AND dc.embedding IS NOT NULL
  `;

  // 3. Optional Document ID filtering
  if (documentId) {
    baseQuery = Prisma.sql`${baseQuery} AND d.id = ${documentId}`;
  }

  // 4. Order and limit
  const finalQuery = Prisma.sql`${baseQuery}
    ORDER BY dc.embedding <=> ${vectorString}::vector
    LIMIT ${topK};
  `;

  // 5. Execute raw SQL query
  const results = await prisma.$queryRaw<SearchResult[]>(finalQuery);

  return results;
}
