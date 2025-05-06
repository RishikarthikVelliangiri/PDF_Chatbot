import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  List, 
  ListItemButton, 
  ListItemText, 
  Box, 
  IconButton, 
  TextField,
  Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';

function ChatSidebar({ 
  chats, 
  activeChatId, 
  onNewChat, 
  onSelectChat, 
  onRenameChat,
  onDeleteChat,
  isCollapsed,
  onToggleCollapse
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id, name, e) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(name);
  };

  const finishEdit = (id) => {
    if (editValue.trim()) {
      onRenameChat(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? '60px' : '250px',
        transition: { duration: 0.3, ease: 'easeInOut' }
      }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(32, 33, 35, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
        minWidth: isCollapsed ? '60px' : '250px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box sx={{ 
        p: isCollapsed ? 1 : 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        flexShrink: 0
      }}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, marginRight: 8 }}
            >
              <ListItemButton 
                onClick={onNewChat} 
                sx={{ 
                  bgcolor: 'rgba(16, 163, 127, 0.9)',
                  borderRadius: 2,
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(16, 163, 127, 1)'
                  }
                }}
              >
                <ListItemText 
                  primary="New Chat" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiListItemText-primary': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }} 
                />
              </ListItemButton>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton 
              onClick={onToggleCollapse}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                flexShrink: 0,
                '&:hover': { color: 'rgba(255, 255, 255, 0.9)' }
              }}
            >
              {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}
          >
            <List sx={{ 
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              px: 1,
              minHeight: 0,
              opacity: isCollapsed ? 0 : 1,
              transition: 'opacity 0.3s ease',
              visibility: isCollapsed ? 'hidden' : 'visible',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)'
                }
              }
            }}>
              {chats.map(chat => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItemButton
                    selected={chat.id === activeChatId}
                    onClick={() => onSelectChat(chat.id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s',
                      bgcolor: chat.id === activeChatId ? 'rgba(52, 53, 65, 0.7)' : 'transparent',
                      minWidth: 0,
                      '&:hover': { 
                        bgcolor: chat.id === activeChatId 
                          ? 'rgba(52, 53, 65, 0.9)' 
                          : 'rgba(255, 255, 255, 0.05)' 
                      },
                      '&.Mui-selected': { 
                        bgcolor: 'rgba(52, 53, 65, 0.7)',
                        '&:hover': { bgcolor: 'rgba(52, 53, 65, 0.9)' } 
                      }
                    }}
                  >
                    {editingId === chat.id ? (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%',
                        minWidth: 0
                      }}>
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          size="small"
                          autoFocus
                          onBlur={() => finishEdit(chat.id)}
                          onKeyDown={(e) => { 
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              finishEdit(chat.id);
                            }
                          }}
                          sx={{ 
                            flex: 1,
                            minWidth: 0,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: 1,
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
                              fontSize: '0.875rem',
                              color: 'rgba(255, 255, 255, 0.9)',
                              maxLength: 40
                            }
                          }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => finishEdit(chat.id)}
                          sx={{ ml: 1, color: 'rgba(16, 163, 127, 0.9)', flexShrink: 0 }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%',
                        minWidth: 0
                      }}>
                        <ListItemText 
                          primary={chat.name} 
                          sx={{ 
                            flex: 1,
                            minWidth: 0,
                            mr: 1,
                            '& .MuiListItemText-primary': {
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }} 
                        />
                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => startEdit(chat.id, chat.name, e)}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                color: 'rgba(255, 255, 255, 0.8)'
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                color: '#ff4444'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </ListItemButton>
                </motion.div>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

ChatSidebar.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      messages: PropTypes.array.isRequired
    })
  ).isRequired,
  activeChatId: PropTypes.string,
  onNewChat: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  onRenameChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired
};

export default ChatSidebar;
