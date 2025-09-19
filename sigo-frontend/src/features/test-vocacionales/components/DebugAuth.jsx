import { useState, useEffect } from 'react';
import api from '../../../services/axios';

const DebugAuth = () => {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setAuthInfo({
      token: token ? `${token.substring(0, 20)}...` : 'No token',
      user: user ? JSON.parse(user) : null,
      baseURL: api.defaults.baseURL,
      headers: api.defaults.headers,
      hostname: window.location.hostname,
      origin: window.location.origin
    });
  }, []);

  const testAPI = async () => {
    try {
      console.log('🧪 Probando API...');
      const response = await api.get('/evaluaciones');
      console.log('✅ API funcionando:', response.data);
      alert('API funcionando correctamente');
    } catch (error) {
      console.error('❌ Error en API:', error);
      alert(`Error en API: ${error.message}`);
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
        🔍 Debug de Autenticación (Solo Desarrollo)
      </h3>
      <div className="text-sm space-y-1">
        <p><strong>Token:</strong> {authInfo.token}</p>
        <p><strong>Usuario:</strong> {authInfo.user?.nombre || 'No usuario'}</p>
        <p><strong>Base URL:</strong> {authInfo.baseURL}</p>
        <p><strong>Hostname:</strong> {authInfo.hostname}</p>
        <p><strong>Origen actual:</strong> {authInfo.origin}</p>
      </div>
      <button 
        onClick={testAPI}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Probar API
      </button>
    </div>
  );
};

export default DebugAuth;
