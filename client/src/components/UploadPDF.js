import React, { useState } from 'react';
import { Box, Button, Typography, Input } from '@mui/material';

function UploadPDF() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadResponse(data.message || data.error);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadResponse('Error uploading file.');
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'grey.700',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Upload PDF
      </Typography>
      <Input
        type="file"
        inputProps={{ accept: 'application/pdf' }}
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload PDF
      </Button>
      {uploadResponse && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          {uploadResponse}
        </Typography>
      )}
    </Box>
  );
}

export default UploadPDF;
