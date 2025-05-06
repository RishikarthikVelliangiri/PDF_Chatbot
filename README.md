# PDF Chatbot Application

This project is a full-stack application that allows users to upload a PDF file and ask questions based on its content. It uses:
- **Gemini API** for language model operations (embeddings and chat completions).
- **Pinecone** as the vector database to store and query embeddings.
- **LlamaIndex** logic for PDF ingestion and querying.
- **React** for the front-end UI.
- **Express** (Node.js) for the back-end server.

## Setup

1. **Server Setup:**
   - Navigate to the `server/` directory.
   - Create a `.env` file inside `server/config/` with your API keys:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     PINECONE_API_KEY=your_pinecone_api_key_here
     PORT=5000
     ```
   - Install dependencies: `npm install`
   - Start the server: `npm run dev`

2. **Client Setup:**
   - Navigate to the `client/` directory.
   - Install dependencies: `npm install`
   - Start the client: `npm start`

## Usage

- Upload a PDF file via the UI.
- Ask questions related to the PDF content.
- The back-end processes the PDF, stores embeddings in Pinecone, and uses the Gemini API to generate answers.
