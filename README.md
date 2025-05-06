# PDF Chatbot Application

A full-stack application that enables users to upload PDFs and have interactive conversations about their content using AI. Built with React, Node.js, Gemini AI, and Pinecone vector database.

## Features

- PDF document upload and processing
- Interactive chat interface
- Context-aware responses using AI
- Vector search for relevant content
- Real-time chat history
- Responsive design with dark mode
- Split panel interface for PDF preview

## Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- Google Cloud Gemini API key
- Pinecone API key and environment

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/RishikarthikVelliangiri/PDF_Chatbot.git
   cd PDF_Chatbot
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Configure environment variables:
   - Navigate to `server/config/`
   - Copy `.env.template` to create a new `.env` file
   - Fill in your API keys and environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     PINECONE_API_KEY=your_pinecone_api_key_here
     PINECONE_ENVIRONMENT=your_pinecone_environment_here
     PORT=5000
     ```

4. Initialize Pinecone index (one-time setup):
   ```bash
   cd server
   node createIndex.js
   ```

5. Start the application:

   In the server directory:
   ```bash
   npm run dev
   ```

   In the client directory (new terminal):
   ```bash
   npm start
   ```

The application should now be running on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Open the application in your browser
2. Click "New Chat" to start a conversation
3. Upload a PDF using the interface on the right
4. Start asking questions about the PDF content
5. The AI will provide context-aware responses based on the document

## Architecture

- **Frontend**: React with Material-UI and Framer Motion
- **Backend**: Node.js with Express
- **Vector Database**: Pinecone for semantic search
- **AI Model**: Google's Gemini AI for embeddings and chat
- **PDF Processing**: PDF parsing and chunking for efficient processing

## Security

- API keys are stored in environment variables
- PDF processing is done server-side
- Chat sessions are isolated
- Rate limiting implemented for API calls

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
