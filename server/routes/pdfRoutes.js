// server/routes/pdfRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadPDF } from '../controllers/pdfcontroller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), uploadPDF);

export default router;
