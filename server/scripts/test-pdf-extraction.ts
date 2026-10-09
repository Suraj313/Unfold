import { extractPdfText } from '../services/pdf-extraction.service';
import path from 'path';
import fs from 'fs';

const testExtraction = async () => {
  const uploadsDir = path.join(__dirname, '../../uploads/documents');
  const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.pdf'));

  if (files.length === 0) {
    console.error('No PDFs found in the uploads directory for testing.');
    process.exit(1);
  }

  // Pick the first available PDF
  const testFile = path.join(uploadsDir, files[0]);
  console.log(`Testing extraction on: ${files[0]}`);

  try {
    const result = await extractPdfText(testFile);
    console.log(`Extraction Successful!`);
    console.log(`Total Pages: ${result.pageCount}`);
    
    if (result.pageCount > 0) {
      console.log(`\n--- Page 1 Preview (First 200 chars) ---`);
      console.log(result.pages[0].text.substring(0, 200));
      console.log(`----------------------------------------`);
      
      if (result.pageCount > 1) {
        console.log(`\n--- Page 2 Preview (First 200 chars) ---`);
        console.log(result.pages[1].text.substring(0, 200));
        console.log(`----------------------------------------`);
      }
    } else {
      console.log('The PDF has 0 pages.');
    }
  } catch (error) {
    console.error('Extraction Failed:', error);
    process.exit(1);
  }
};

testExtraction();
