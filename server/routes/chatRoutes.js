import express from 'express';
import { newChat, askQuestion, uploadPdfForChat, uploadMiddleware } from '../controllers/ChatController.js';

const router = express.Router();

router.post('/new', newChat);
router.post('/upload/:chatId', uploadMiddleware, uploadPdfForChat);
router.post('/ask', askQuestion);

export default router;
