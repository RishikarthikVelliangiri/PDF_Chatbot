// server/createIndex.js
import { Pinecone } from '@pinecone-database/pinecone';
import config from './config/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv to load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'config', '.env') });

async function createIndex() {
  const pc = new Pinecone({
    apiKey: config.pinecone.apiKey
  });

  try {
    // Check if index already exists
    const { indexes } = await pc.listIndexes();
    console.log('Existing indexes:', indexes);
    
    // Check if our index exists in the list
    const indexExists = indexes.some(index => index.name === config.pinecone.indexName);
    if (indexExists) {
      console.log(`Index ${config.pinecone.indexName} already exists`);
      return;
    }

    const result = await pc.createIndex({
      name: config.pinecone.indexName,
      dimension: 3072,  // For gemini-embedding-exp-03-07 model
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: config.pinecone.environment
        }
      }
    });
    console.log('Index creation result:', result);
  } catch (error) {
    console.error('Error creating index:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

createIndex();
