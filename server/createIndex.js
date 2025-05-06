// server/createIndex.js
import { Pinecone } from '@pinecone-database/pinecone';
import config from './config/default.js';

async function createIndex() {
  const pc = new Pinecone({
    apiKey: config.pinecone.apiKey
  });

  try {
    // Check if index already exists
    const indexList = await pc.listIndexes();
    if (indexList.includes(config.pinecone.indexName)) {
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
  }
}

createIndex();
