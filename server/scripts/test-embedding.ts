import { PrismaClient } from '@prisma/client';
import { processChunkEmbedding } from '../services/chunk-embedding.service';
import 'dotenv/config';

const prisma = new PrismaClient();

async function runTest() {
  try {
    // 1. Find a chunk
    const chunks = await prisma.documentChunk.findMany({
      take: 1,
    });

    if (chunks.length === 0) {
      console.log('No DocumentChunks found in the database. Please ensure document extraction and chunking have been run first. Skipping embedding generation test to avoid creating fake data.');
      return;
    }

    const chunk = chunks[0];
    console.log(`Found chunk: ${chunk.id} (Page: ${chunk.pageNumber}, Index: ${chunk.chunkIndex}, Text Length: ${chunk.text.length})`);

    // 2. Generate and store embedding (first run)
    console.log('Processing chunk embedding...');
    const processed = await processChunkEmbedding(chunk.id);
    console.log(`Initial processing result: ${processed ? 'Generated & Stored' : 'Skipped (Already existed)'}`);

    // 3. Read it back
    const rawChunks = await prisma.$queryRaw<{ id: string, embedding_dim: number }[]>`
      SELECT id, vector_dims(embedding) as embedding_dim
      FROM "DocumentChunk"
      WHERE id = ${chunk.id}::text
    `;

    if (rawChunks.length > 0) {
      const dim = rawChunks[0].embedding_dim;
      console.log(`Stored embedding dimension verified: ${dim}`);

      if (dim !== 768) {
        console.error(`ERROR: Expected dimension 768, got ${dim}`);
      }
    } else {
      console.error('ERROR: Could not retrieve chunk after processing.');
    }

    // 4. Test Idempotency (second run)
    console.log('Testing idempotency (running again)...');
    const processedSecondTime = await processChunkEmbedding(chunk.id);
    console.log(`Second processing result: ${processedSecondTime ? 'Generated & Stored' : 'Skipped (Already existed)'}`);
    
    if (processedSecondTime) {
      console.error('ERROR: Idempotency failed. The service processed the chunk again.');
    } else {
      console.log('Idempotency verified successfully.');
    }

  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
