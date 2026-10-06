import fs from 'fs';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedDocument {
  pageCount: number;
  pages: ExtractedPage[];
}

export const extractPdfText = async (filePath: string): Promise<ExtractedDocument> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const { PDFExtract } = await import('pdf.js-extract');
  const pdfExtract = new PDFExtract();
  const options: any = {};

  try {
    const data = await pdfExtract.extract(filePath, options);
    
    if (!data || !data.pages) {
      throw new Error('Failed to extract data or pages array is missing.');
    }

    const pages: ExtractedPage[] = data.pages.map((page, index) => {
      let pageText = '';
      let lastY: number | null = null;
      
      const sortedContent = [...page.content].sort((a, b) => {
         if (Math.abs(a.y - b.y) > 2) {
             return a.y - b.y;
         }
         return a.x - b.x;
      });

      for (const item of sortedContent) {
        if (lastY !== null && Math.abs(item.y - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        
        pageText += item.str;
        lastY = item.y;
      }

      return {
        pageNumber: index + 1,
        text: pageText.trim()
      };
    });

    return {
      pageCount: pages.length,
      pages,
    };
  } catch (error: any) {
    throw new Error(`PDF Extraction failed: ${error.message || 'Unknown error'}`);
  }
};
