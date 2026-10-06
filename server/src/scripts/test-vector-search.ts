import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function runTest() {
  try {
    // 1. Find a user and a document
    const document = await prisma.document.findFirst({
      where: { processingStatus: 'READY' }
    });

    if (!document) {
      console.log('No READY documents found in the database. Please process a document first. Skipping vector search test.');
      return;
    }

    console.log(`Using Document: ${document.id} (Title: ${document.title}) belonging to User: ${document.userId}`);

    if (!process.env.OPENAI_API_KEY) {
      console.log('\nREAL OPENAI SEARCH TEST = NOT PERFORMED');
      console.log('Reason: No OPENAI_API_KEY environment variable found. The OpenAI SDK requires it at startup.');
      return;
    }

    // Dynamic import to avoid OpenAI initialization crash if key is missing
    const { searchSimilarChunks } = await import('../services/vector-search.service');

    // A. Basic semantic search
    console.log('\n--- A. Basic semantic search ---');
    const query = 'What is the function of the ALU?';
    console.log(`Query: "${query}"`);
    
    let results = await searchSimilarChunks({
      userId: document.userId,
      query,
      topK: 5
    });

    console.log(`Results count: ${results.length}`);
    results.forEach((res, index) => {
      console.log(`\nResult ${index + 1}:`);
      console.log(`Document Title: ${res.documentTitle}`);
      console.log(`Page: ${res.pageNumber}, Chunk Index: ${res.chunkIndex}`);
      console.log(`Similarity: ${res.similarity.toFixed(4)}`);
      console.log(`Text preview: ${res.text.substring(0, 50).replace(/\n/g, ' ')}...`);
    });

    // B. topK Test
    console.log('\n--- B. topK test (topK = 3) ---');
    results = await searchSimilarChunks({
      userId: document.userId,
      query,
      topK: 3
    });
    console.log(`Results count: ${results.length} (Expected max 3)`);
    if (results.length > 3) {
      console.error('ERROR: topK limit exceeded!');
    }

    // C. Document filtering test
    console.log('\n--- C. Document filtering test ---');
    results = await searchSimilarChunks({
      userId: document.userId,
      query,
      topK: 5,
      documentId: document.id
    });
    console.log(`Results count: ${results.length}`);
    const otherDocs = results.filter(r => r.documentId !== document.id);
    if (otherDocs.length > 0) {
      console.error('ERROR: Found results from other documents despite filter!');
    } else {
      console.log('Document filtering verified successfully.');
    }

    // D. User isolation test
    console.log('\n--- D. User isolation test ---');
    console.log('Querying with a fake user ID...');
    results = await searchSimilarChunks({
      userId: '00000000-0000-0000-0000-000000000000',
      query,
      topK: 5
    });
    console.log(`Results count: ${results.length} (Expected 0)`);
    if (results.length > 0) {
      console.error('ERROR: Cross-user data leakage detected!');
    } else {
      console.log('User isolation verified successfully.');
    }

  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
