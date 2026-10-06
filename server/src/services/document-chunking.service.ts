export interface ChunkOptions {
  targetChunkSizeWords?: number;
  overlapWords?: number;
}

export interface DocumentChunkOutput {
  documentId: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
}

export const chunkDocumentPages = (
  documentId: string,
  pages: Array<{ pageNumber: number; text: string }>,
  options: ChunkOptions = {}
): DocumentChunkOutput[] => {
  const targetChunkSize = options.targetChunkSizeWords || 600;
  const overlapSize = options.overlapWords || 100;
  const chunks: DocumentChunkOutput[] = [];
  let chunkIndex = 0;

  // Helper to split text by a specific separator, preserving the separator if needed
  const splitWithSeparator = (text: string, separator: string | RegExp): string[] => {
    if (separator === '') return text.split('');
    return text.split(separator).filter(Boolean);
  };

  // Helper to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  for (const page of pages) {
    if (!page.text || page.text.trim() === '') {
      continue;
    }

    const pageWordsCount = countWords(page.text);
    if (pageWordsCount <= targetChunkSize) {
      chunks.push({
        documentId,
        pageNumber: page.pageNumber,
        chunkIndex: chunkIndex++,
        text: page.text.trim()
      });
      continue;
    }

    // Split page into paragraphs
    const paragraphs = page.text.split(/(?<=\n\s*\n)/); // Split by double newlines
    let currentChunkText = '';
    let currentChunkWords = 0;

    const finalizeChunk = () => {
      if (currentChunkText.trim().length > 0) {
        chunks.push({
          documentId,
          pageNumber: page.pageNumber,
          chunkIndex: chunkIndex++,
          text: currentChunkText.trim()
        });
      }
    };

    const processUnit = (unit: string) => {
      const unitWords = countWords(unit);
      
      // If adding this unit exceeds the target, and we already have some text
      if (currentChunkWords + unitWords > targetChunkSize && currentChunkWords > 0) {
        finalizeChunk();
        
        // Setup the new chunk with overlap
        // We take the last `overlapSize` words from the previous chunk
        const previousWords = currentChunkText.trim().split(/\s+/);
        const overlapWords = previousWords.slice(-overlapSize).join(' ');
        
        currentChunkText = overlapWords + (overlapWords ? ' ' : '') + unit;
        currentChunkWords = countWords(currentChunkText);
      } else {
        currentChunkText += (currentChunkText ? ' ' : '') + unit;
        currentChunkWords = countWords(currentChunkText);
      }
    };

    const breakIntoLines = (text: string) => {
      const lines = text.split(/(?<=\n)/);
      for (const line of lines) {
        if (countWords(line) > targetChunkSize) {
          breakIntoSentences(line);
        } else {
          processUnit(line);
        }
      }
    };

    const breakIntoSentences = (text: string) => {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      for (const sentence of sentences) {
        if (countWords(sentence) > targetChunkSize) {
          breakIntoWords(sentence);
        } else {
          processUnit(sentence);
        }
      }
    };

    const breakIntoWords = (text: string) => {
      const words = text.split(/\s+/);
      for (const word of words) {
        processUnit(word);
      }
    };

    for (const paragraph of paragraphs) {
      if (countWords(paragraph) > targetChunkSize) {
        breakIntoLines(paragraph);
      } else {
        processUnit(paragraph);
      }
    }

    finalizeChunk();
  }

  return chunks;
};
