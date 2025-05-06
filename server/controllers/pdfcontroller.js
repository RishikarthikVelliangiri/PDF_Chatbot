// server/controllers/pdfcontroller.js
import { processPDF } from '../services/llamaIndexService.js';

export function uploadPDF(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  processPDF(req.file.buffer)
    .then(() => res.status(200).json({ message: 'PDF processed successfully' }))
    .catch(error => {
      console.error('Error processing PDF:', error);
      res.status(500).json({ error: 'Error processing PDF' });
    });
}
