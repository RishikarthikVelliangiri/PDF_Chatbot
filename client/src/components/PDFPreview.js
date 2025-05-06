import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Box, Button } from '@mui/material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const PDFPreview = ({ chatId, pdfUrl, pdfText, onPdfUrlChange, onUpload }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Clear the PDF viewer when chatId changes and there's no PDF for this chat
    if (!pdfUrl) {
      setUrl('');
    } else {
      setUrl(pdfUrl);
    }
  }, [chatId, pdfUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    } else {
      // Show error for invalid file type
      console.error('Please upload a PDF file');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%', width: '100%' }}
    >
      <Paper sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        background: 'rgba(32, 33, 35, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
        minWidth: 0,
        minHeight: 0,
        position: 'relative'
      }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
            zIndex: 1
          }}>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontWeight: 600,
              flex: 1
            }}>
              PDF Preview
            </Typography>
            <Button
              variant="contained"
              component="label"
              disabled={!chatId}
              sx={{
                bgcolor: 'rgba(16, 163, 127, 0.9)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                '&:hover': {
                  bgcolor: 'rgba(16, 163, 127, 1)'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(16, 163, 127, 0.4)'
                }
              }}
            >
              Upload PDF
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </motion.div>

        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 0,
          position: 'relative',
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
          <AnimatePresence mode="wait">
            {url ? (
              <motion.div
                key="pdf-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                <iframe
                  src={url}
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center'
                }}>
                  Upload a PDF to start chatting about its contents
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Paper>
    </motion.div>
  );
};

PDFPreview.propTypes = {
  chatId: PropTypes.string,
  pdfText: PropTypes.string,
  pdfUrl: PropTypes.string,
  onPdfUrlChange: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired
};

export default PDFPreview;
