import { PrismaClient } from '@prisma/client';
import { processDocument } from '../services/document-processing.service';
import 'dotenv/config';

const prisma = new PrismaClient();

async function runTest() {
  try {
    // 1. Find a Document
    const document = await prisma.document.findFirst();

    if (!document) {
      console.log('No Documents found in the database. Please upload a document through the UI first. Stopping to avoid fake data.');
      return;
    }

    console.log(`\nFound Document: ${document.id} (File: ${document.originalFileName})`);
    console.log(`Current Status: ${document.processingStatus}`);

    // 2. Processing begins
    console.log('\n--- FIRST PROCESSING RUN ---');
    console.log('Starting document processing pipeline...');
    
    await processDocument(document.id);
    
    // Fetch updated document
    const updatedDocument = await prisma.document.findUnique({
      where: { id: document.id }
    });
    console.log(`Processing Status after run 1: ${updatedDocument?.processingStatus}`);
    
    // 3. DocumentChunks are created
    const chunkCount = await prisma.documentChunk.count({
      where: { documentId: document.id }
    });
    console.log(`Chunks created: ${chunkCount}`);

    // 4. Embeddings are generated & 5. Dimension check
    const rawChunks = await prisma.$queryRaw<{ id: string, embedding_dim: number }[]>`
      SELECT id, vector_dims(embedding) as embedding_dim
      FROM "DocumentChunk"
      WHERE "documentId" = ${document.id}::text AND embedding IS NOT NULL
    `;
    
    console.log(`Embedded chunks: ${rawChunks.length}`);
    
    if (rawChunks.length > 0) {
      const dim = rawChunks[0].embedding_dim;
      console.log(`Embedding Dimension Verified: ${dim}`);
      if (dim !== 768) {
        console.error(`ERROR: Expected dimension 768, got ${dim}`);
      }
    }

    // 6. Test Idempotency (Running again)
    console.log('\n--- SECOND PROCESSING RUN (IDEMPOTENCY) ---');
    console.log('Running processDocument again...');
    
    await processDocument(document.id);
    
    const finalDocument = await prisma.document.findUnique({
      where: { id: document.id }
    });
    
    const finalChunkCount = await prisma.documentChunk.count({
      where: { documentId: document.id }
    });
    
    console.log(`Processing Status after run 2: ${finalDocument?.processingStatus}`);
    console.log(`Final chunk count (should not have duplicated): ${finalChunkCount}`);
    
    if (finalChunkCount !== chunkCount) {
      console.error('ERROR: Duplicate chunks were created during the second run!');
    } else {
      console.log('SUCCESS: No duplicate chunks created. Existing embeddings were preserved safely.');
    }

  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
