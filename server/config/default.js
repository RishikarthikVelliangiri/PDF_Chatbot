// server/config/default.js
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
