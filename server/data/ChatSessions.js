// In-memory chat store. Replace with a DB for production.
const chatSessions = {};

export function createChatSession() {
  const chatId = Date.now().toString();
  chatSessions[chatId] = {
    id: chatId,
    name: 'New Chat',
    pdf: null,         // extracted text of uploaded PDF
    messages: []       // { role: 'user'|'assistant', text: string }[]
  };
  return chatSessions[chatId];
}

export function getChatSession(chatId) {
  return chatSessions[chatId];
}

export function updateChatSession(chatId, session) {
  chatSessions[chatId] = session;
}

export function deleteChatSession(chatId) {
  delete chatSessions[chatId];
}
