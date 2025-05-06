// server/readPdf.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the absolute path to your PDF file in the "test/data" directory
const filePath = path.join(__dirname, 'test', 'data', '05-versions-space.pdf');

console.log("Resolved file path:", filePath);

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error("File not found at:", filePath);
  process.exit(1);
}

try {
  // Read the PDF file into a buffer
  const pdfBuffer = fs.readFileSync(filePath);
  
  // Parse the PDF buffer
  pdfParse(pdfBuffer)
    .then(data => {
      console.log("Extracted text from PDF:");
      console.log(data.text);
    })
    .catch(err => {
      console.error("Error parsing PDF:", err);
    });
} catch (err) {
  console.error("Error reading file:", err);
}
