import pdfParse from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import config from '../config/default.js';
import { storeEmbeddings, queryEmbeddings } from './vectorDbService.js';

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

// Add jitter to the retry delay to prevent thundering herd
function getJitteredDelay(baseDelay) {
  const jitter = baseDelay * 0.1 * Math.random();
  return baseDelay + jitter;
}

// Simple rate limiting - ensure minimum time between requests
let lastRequestTime = 0;
const MIN_REQUEST_GAP = 500; // 500ms minimum between requests

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_GAP) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_GAP - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

// Enhanced retry utility with better error handling
async function retryWithBackoff(operation, maxRetries = 5, initialDelay = 2000) {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      await waitForRateLimit();
      return await operation();
    } catch (err) {
      retries++;
      
      // Check if error is retryable
      const isRetryable = 
        err.message?.includes('503') || // Service unavailable
        err.message?.includes('429') || // Rate limit
        err.message?.includes('timeout') ||
        err.message?.toLowerCase().includes('overloaded');

      if (retries === maxRetries || !isRetryable) {
        console.error(`Operation failed after ${retries} attempts:`, err);
        throw err;
      }
      
      const jitteredDelay = getJitteredDelay(delay);
      console.log(`Attempt ${retries}/${maxRetries} failed, retrying in ${Math.round(jitteredDelay/1000)}s...`);
      console.log(`Error details: ${err.message}`);
      
      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
      delay *= 1.5; // Slower exponential backoff
    }
  }
}

// Store embeddings with chat ID as namespace
export async function processPDF(pdfBuffer, chatId) {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    console.log('Extracted text length:', text.length);

    // Generate and store embeddings with retry
    const embedRes = await retryWithBackoff(async () => {
      return await ai.models.embedContent({
        model: config.gemini.embeddingModel,
        contents: text,
        config: { taskType: 'SEMANTIC_SIMILARITY' }
      });
    });

    const vector = embedRes.embeddings[0].values;
    console.log('Embedding length:', vector.length);
    
    // Store embeddings with chat ID in metadata
    await storeEmbeddings(vector, text, chatId);

    return { text };
  } catch (err) {
    console.error('processPDF error:', err);
    throw err;
  }
}

export async function askLlamaIndex(question, history, chatId) {
  try {
    // Embed question with retry
    const qEmbedRes = await retryWithBackoff(async () => {
      return await ai.models.embedContent({
        model: config.gemini.embeddingModel,
        contents: question,
        config: { taskType: 'SEMANTIC_SIMILARITY' }
      });
    });

    const qVector = qEmbedRes.embeddings[0].values;
    // Query embeddings for this specific chat
    const context = await queryEmbeddings(qVector, chatId);

    // Clean history and convert 'assistant' role to 'model'
    const cleanHistory = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: typeof m.text === 'string' ? m.text : JSON.stringify(m.text) }]
    }));

    // Build chat history - start with the user's context question
    const msgs = [
      { 
        role: 'user', 
        parts: [{ text: `You are a helpful assistant. Here is some context to help answer questions: ${context}` }]
      },
      { 
        role: 'model', 
        parts: [{ text: `I understand. I'll use this context to help answer questions.` }]
      },
      ...cleanHistory
    ];

    // Create chat with retry
    const chat = ai.chats.create({
      model: config.gemini.chatModel,
      history: msgs,
      generationConfig: { 
        temperature: 0.5, 
        maxOutputTokens: 256,
        candidateCount: 1,
        stopSequences: []
      }
    });

    // Send message with retry and better error context
    const reply = await retryWithBackoff(async () => {
      try {
        return await chat.sendMessage({ 
          message: question,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 256
          }
        });
      } catch (err) {
        // Add context to error for better debugging
        throw new Error(`Failed to get response from Gemini API: ${err.message}`);
      }
    });
    
    let responseText = reply.text;
    if (typeof responseText !== 'string') {
      console.warn('Non-string response received:', responseText);
      responseText = String(responseText);
    }

    return responseText;
  } catch (err) {
    console.error('askLlamaIndex error:', err);
    throw err;
  }
}
