import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ChatSidebar from './components/ChatSidebar';
import ChatInterface from './components/ChatInterface';
import PDFPreview from './components/PDFPreview';
import './styles/panels.css';

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatPdfUrls, setChatPdfUrls] = useState({});
  const [chatPdfTexts, setChatPdfTexts] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handlePdfUpload = async (file) => {
    if (!activeChatId) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`http://localhost:5000/api/chat/upload/${activeChatId}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      // Store PDF URL and text for the current chat
      setChatPdfUrls(prev => ({
        ...prev,
        [activeChatId]: URL.createObjectURL(file)
      }));
      
      setChatPdfTexts(prev => ({
        ...prev,
        [activeChatId]: data.pdf
      }));
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/new', {
        method: 'POST'
      });
      const { chat } = await response.json();
      
      setChats(prev => [...prev, { 
        id: chat.id, 
        name: 'New Chat', 
        messages: []
      }]);
      setActiveChatId(chat.id);
    } catch (err) {
      console.error('Create chat failed:', err);
    }
  };

  const handleSwitchChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleSendMessage = async (chatId, question) => {
    try {
      const res = await fetch('http://localhost:5000/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, question })
      });
      const { messages } = await res.json();
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages } : c));
    } catch (err) {
      console.error('Send message failed:', err);
    }
  };

  const handleRenameChat = (chatId, newName) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, name: newName } : c));
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await fetch(`http://localhost:5000/api/chat/${chatId}`, { 
        method: 'DELETE'
      });
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      setChatPdfUrls(prev => {
        const newState = { ...prev };
        delete newState[chatId];
        return newState;
      });
      setChatPdfTexts(prev => {
        const newState = { ...prev };
        delete newState[chatId];
        return newState;
      });
    } catch (err) {
      console.error('Delete chat failed:', err);
    }
  };

  const validChats = chats.filter(c => c && Array.isArray(c.messages) && c.messages.every(m => typeof m.text === 'string'));
  const activeChat = validChats.find(c => c.id === activeChatId);

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <Box sx={{ 
        display: 'flex', 
        height: '100%',
        transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Box sx={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}>
          <ChatSidebar 
            chats={validChats}
            activeChatId={activeChatId}
            onNewChat={handleCreateNewChat}
            onSelectChat={handleSwitchChat}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </Box>

        <Box sx={{ 
          flex: 1,
          ml: isSidebarCollapsed ? '60px' : '250px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <PanelGroup 
            direction="horizontal" 
            style={{ height: '100%', width: '100%' }}
          >
            <Panel 
              defaultSize={60} 
              minSize={40}
              style={{ display: 'flex' }}
            >
              <Box sx={{ 
                width: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <ChatInterface 
                  chat={activeChat} 
                  onSendMessage={handleSendMessage}
                  hasPdfUploaded={Boolean(chatPdfTexts[activeChat?.id])}
                  uploading={isUploading}
                />
              </Box>
            </Panel>

            <Panel 
              defaultSize={40} 
              minSize={30}
              style={{ display: 'flex' }}
            >
              <Box sx={{ 
                width: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <PDFPreview 
                  chatId={activeChat?.id}
                  pdfText={chatPdfTexts[activeChat?.id] || null}
                  pdfUrl={chatPdfUrls[activeChat?.id] || null}
                  onPdfUrlChange={(url) => {
                    if (!url) {
                      setChatPdfUrls(prev => {
                        const newState = { ...prev };
                        delete newState[activeChat?.id];
                        return newState;
                      });
                      setChatPdfTexts(prev => {
                        const newState = { ...prev };
                        delete newState[activeChat?.id];
                        return newState;
                      });
                    }
                  }}
                  onUpload={(file) => handlePdfUpload(file)}
                />
              </Box>
            </Panel>
          </PanelGroup>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
