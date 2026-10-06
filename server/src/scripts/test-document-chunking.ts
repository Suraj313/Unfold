import { extractPdfText } from '../services/pdf-extraction.service';
import { chunkDocumentPages } from '../services/document-chunking.service';
import path from 'path';
import fs from 'fs';

const generateWords = (count: number, prefix = 'word'): string => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i}`).join(' ');
};

const runSyntheticTests = () => {
  console.log('--- RUNNING SYNTHETIC TESTS ---');
  const documentId = 'synthetic-doc';

  // 1. SHORT PAGE
  console.log('\nTest 1: SHORT PAGE (50 words)');
  const shortPageText = generateWords(50, 'short');
  const shortChunks = chunkDocumentPages(documentId, [{ pageNumber: 1, text: shortPageText }], { targetChunkSizeWords: 600, overlapWords: 100 });
  console.log(`Chunks produced: ${shortChunks.length} (Expected: 1)`);
  if (shortChunks.length > 0) {
    const wordCount = shortChunks[0].text.trim().split(/\s+/).length;
    console.log(`Chunk word count: ${wordCount} (Expected: 50)`);
    console.log(`Text preserved: ${shortChunks[0].text === shortPageText}`);
  }

  // 2. LONG PAGE
  console.log('\nTest 2: LONG PAGE (1300 words)');
  const longPageText = generateWords(1300, 'long');
  const longChunks = chunkDocumentPages(documentId, [{ pageNumber: 1, text: longPageText }], { targetChunkSizeWords: 600, overlapWords: 100 });
  console.log(`Chunks produced: ${longChunks.length} (Expected: >1)`);
  
  let validSequence = true;
  for (let i = 0; i < longChunks.length; i++) {
    if (longChunks[i].chunkIndex !== i) validSequence = false;
    if (longChunks[i].pageNumber !== 1) console.error(`Invalid pageNumber in chunk ${i}`);
    if (longChunks[i].text.trim() === '') console.error(`Empty chunk ${i}`);
    
    const wordCount = longChunks[i].text.trim().split(/\s+/).length;
    console.log(`Chunk ${i} word count: ${wordCount}`);
    
    if (i > 0) {
      // Check overlap
      const prevWords = longChunks[i - 1].text.trim().split(/\s+/);
      const currentWords = longChunks[i].text.trim().split(/\s+/);
      
      let overlapCount = 0;
      for (let j = 1; j <= Math.min(prevWords.length, currentWords.length); j++) {
        if (prevWords.slice(-j).join(' ') === currentWords.slice(0, j).join(' ')) {
          overlapCount = j;
        }
      }
      console.log(`Overlap between chunk ${i - 1} and ${i}: ${overlapCount} words (Expected: ~100)`);
    }
  }
  console.log(`Sequential chunkIndex: ${validSequence}`);

  // 3 & 4. MULTI-PAGE & EMPTY PAGE
  console.log('\nTest 3 & 4: MULTI-PAGE & EMPTY PAGE (Page 1: 1300w, Page 2: 0w, Page 3: 1300w)');
  const multiPages = [
    { pageNumber: 1, text: generateWords(1300, 'p1') },
    { pageNumber: 2, text: '   \n   ' },
    { pageNumber: 3, text: generateWords(1300, 'p3') }
  ];
  
  const multiChunks = chunkDocumentPages(documentId, multiPages, { targetChunkSizeWords: 600, overlapWords: 100 });
  console.log(`Total Chunks produced: ${multiChunks.length}`);
  
  let validGlobalSequence = true;
  for (let i = 0; i < multiChunks.length; i++) {
    if (multiChunks[i].chunkIndex !== i) validGlobalSequence = false;
    if (multiChunks[i].pageNumber === 2) console.error(`Error: Chunk created for empty page 2`);
    
    // verify cross page overlap
    if (i > 0 && multiChunks[i-1].pageNumber !== multiChunks[i].pageNumber) {
      const prevWords = multiChunks[i-1].text.trim().split(/\s+/);
      const currentWords = multiChunks[i].text.trim().split(/\s+/);
      
      let overlapCount = 0;
      for (let j = 1; j <= Math.min(prevWords.length, currentWords.length); j++) {
        if (prevWords.slice(-j).join(' ') === currentWords.slice(0, j).join(' ')) {
          overlapCount = j;
        }
      }
      console.log(`Overlap between chunk ${i-1} (Page ${multiChunks[i-1].pageNumber}) and chunk ${i} (Page ${multiChunks[i].pageNumber}): ${overlapCount} words (Expected: 0)`);
    }
  }
  console.log(`Sequential global chunkIndex: ${validGlobalSequence}`);
  console.log('----------------------------------------\n');
};

const testChunking = async () => {
  runSyntheticTests();

  console.log('--- RUNNING REAL PDF TEST ---');
  const uploadsDir = path.join(__dirname, '../../uploads/documents');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('Uploads directory does not exist.');
    process.exit(1);
  }

  const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.pdf'));

  if (files.length === 0) {
    console.error('No PDFs found in the uploads directory for testing.');
    process.exit(1);
  }

  const testFile = files[0];
  const testFilePath = path.join(uploadsDir, testFile);
  const documentId = 'test-doc-real';

  console.log(`Testing chunking on: ${testFile}`);

  try {
    const extractionResult = await extractPdfText(testFilePath);
    console.log(`Extraction successful. Total Pages: ${extractionResult.pageCount}`);

    const chunks = chunkDocumentPages(documentId, extractionResult.pages, {
      targetChunkSizeWords: 600,
      overlapWords: 100
    });

    console.log(`Chunking successful. Total Chunks: ${chunks.length}`);

    for (let i = 0; i < Math.min(chunks.length, 5); i++) {
      const chunk = chunks[i];
      const wordCount = chunk.text.trim().split(/\s+/).length;
      console.log(`Chunk ${chunk.chunkIndex} (Page ${chunk.pageNumber}) - ${wordCount} words`);
      console.log(`Text Preview: ${chunk.text.substring(0, 150).replace(/\n/g, ' ')}...`);
      console.log('---');
    }

    if (chunks.length > 5) {
      console.log(`... and ${chunks.length - 5} more chunks.`);
    }

  } catch (error) {
    console.error('Chunking Test Failed:', error);
    process.exit(1);
  }
};

testChunking();
