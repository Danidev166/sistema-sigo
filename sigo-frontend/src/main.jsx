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
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
              },
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
