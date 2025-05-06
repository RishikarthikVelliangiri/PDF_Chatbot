// server/services/vectorDbService.js
import { Pinecone } from '@pinecone-database/pinecone';
import config from '../config/default.js';

const pc = new Pinecone({ apiKey: config.pinecone.apiKey });
const index = pc.index(config.pinecone.indexName);

export async function storeEmbeddings(vector, text, chatId) {
  try {
    // Include chatId in metadata to isolate PDFs per chat
    await index.upsert([{
      id: `${chatId}-${Date.now()}`,
      values: vector,
      metadata: {
        text,
        chatId
      }
    }]);
  } catch (error) {
    console.error('Error storing embeddings:', error);
    throw error;
  }
}

export async function queryEmbeddings(vector, chatId) {
  try {
    // Query only embeddings for this specific chat
    const results = await index.query({
      vector,
      topK: 3,
      filter: { chatId: { $eq: chatId } },
      includeMetadata: true
    });

    // Combine the text from the top matches
    return results.matches
      .map(match => match.metadata.text)
      .join('\n\n');
  } catch (error) {
    console.error('Error querying embeddings:', error);
    throw error;
  }
}