// server/config/default.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Validate required environment variables
const requiredEnvVars = ['PINECONE_API_KEY', 'GEMINI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default {
  port: process.env.PORT || 5000,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    embeddingModel: 'gemini-embedding-exp-03-07',
    chatModel: 'gemini-2.0-flash'
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
    indexName: 'pdf-index'
  }
};
