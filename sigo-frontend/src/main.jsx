import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider'; // ✅ Import correcto
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/typography.css'; // Importación de tipografía moderna
import './styles/modern-effects.css'; // Importación de efectos modernos

// Debug API URL
import './debug-api.js';
import './styles/responsive.css'; // Importación de utilidades responsive

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
