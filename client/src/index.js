import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProvider>
);
