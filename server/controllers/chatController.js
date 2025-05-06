import { createChatSession, getChatSession, updateChatSession, deleteChatSession } from '../data/ChatSessions.js';
import { processPDF, askLlamaIndex } from '../services/llamaIndexService.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single('file');

export async function newChat(req, res) {
  try {
    const chat = createChatSession();
    res.json({ chat });
  } catch (err) {
    console.error('newChat error:', err);
    res.status(500).json({ error: 'Could not create chat.' });
  }
}

export async function uploadPdfForChat(req, res) {
  try {
    const { chatId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const chat = getChatSession(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found.' });

    console.log(`Processing PDF for chat ${chatId}…`);
    const { text: pdfText } = await processPDF(req.file.buffer, chatId); // Pass chatId to processPDF
    chat.pdf = pdfText;
    updateChatSession(chatId, chat);

    res.json({ message: 'PDF processed.', pdf: pdfText, chat });
  } catch (err) {
    console.error('uploadPdfForChat error:', err);
    res.status(500).json({ error: 'Error processing PDF.' });
  }
}

export async function askQuestion(req, res) {
  try {
    const { chatId, question } = req.body;
    if (!chatId || !question) {
      return res.status(400).json({ error: 'chatId and question required.' });
    }

    const chat = getChatSession(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found.' });
    if (!chat.pdf) return res.status(400).json({ error: 'No PDF uploaded for this chat.' });

    // Ensure question is a string
    const questionText = String(question);
    
    // Append user message
    chat.messages.push({ role: 'user', text: questionText });

    // Ask the AI, passing full history and chatId
    let answer = await askLlamaIndex(questionText, chat.messages, chatId);
    
    // Convert answer to string and clean it
    const cleanAnswer = (() => {
      if (typeof answer === 'string') return answer;
      if (answer === null || answer === undefined) return '';
      if (typeof answer === 'object') {
        if (answer.$$typeof || answer._owner) {
          console.warn('Received React element as answer:', answer);
          return '[Error: Invalid response format]';
        }
        try {
          return JSON.stringify(answer);
        } catch {
          return '[Error: Unstringifiable response]';
        }
      }
      return String(answer);
    })();

    // Append model response
    chat.messages.push({ role: 'model', text: cleanAnswer });
    updateChatSession(chatId, chat);

    res.json({ answer: cleanAnswer, messages: chat.messages });
  } catch (err) {
    console.error('askQuestion error:', err);
    res.status(500).json({ error: 'Error answering question.' });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const chat = getChatSession(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found.' });

    deleteChatSession(chatId);
    res.json({ message: 'Chat deleted successfully.' });
  } catch (err) {
    console.error('deleteChat error:', err);
    res.status(500).json({ error: 'Could not delete chat.' });
  }
}
