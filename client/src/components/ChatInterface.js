import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
  >
    <Box sx={{ 
      display: 'flex', 
      gap: 0.5, 
      p: 2,
      maxWidth: '80px',
      borderRadius: 2,
      backgroundColor: 'rgba(52, 53, 65, 0.9)',
      backdropFilter: 'blur(5px)',
    }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </Box>
  </motion.div>
);

function ChatInterface({ chat, onSendMessage, hasPdfUploaded }) {
  const [message, setMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chat) return;
    
    if (!hasPdfUploaded) return;
    
    const messageText = message.trim();
    setMessage('');
    setIsAiTyping(true);
    
    try {
      await onSendMessage(chat.id, messageText);
    } finally {
      setIsAiTyping(false);
    }
  };

  if (!chat) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 2
      }}>
        <Typography variant="body1" color="text.secondary">
          Select a chat to start the conversation
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      {/* Messages Area */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {chat && !hasPdfUploaded && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a PDF document in the right panel to start chatting
          </Alert>
        )}
        
        <AnimatePresence>
          {chat?.messages.map((msg, index) => (
            <motion.div
              key={`${msg.role}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.1 
              }}
            >
              <Box
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: msg.role === 'user' 
                    ? 'rgba(16, 163, 127, 0.9)' 
                    : 'rgba(52, 53, 65, 0.9)',
                  borderRadius: 2,
                  p: 2,
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </motion.div>
          ))}
          
          {isAiTyping && (
            <TypingIndicator />
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={hasPdfUploaded ? "Type your message..." : "Upload a PDF to start chatting"}
            disabled={!hasPdfUploaded}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                overflow: 'hidden',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(16, 163, 127, 0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10a37f'
                }
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          />
          <IconButton 
            type="submit"
            disabled={!message.trim() || !hasPdfUploaded}
            sx={{ 
              backgroundColor: 'rgba(16, 163, 127, 0.9)',
              borderRadius: 2,
              p: 1,
              '&:hover': {
                backgroundColor: 'rgba(16, 163, 127, 1)'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <SendIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

ChatInterface.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    ).isRequired
  }),
  onSendMessage: PropTypes.func.isRequired,
  hasPdfUploaded: PropTypes.bool.isRequired
};

export default ChatInterface;
