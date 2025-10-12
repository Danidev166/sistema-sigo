// Script para probar el despliegue en Render
const express = require('express');
const cors = require('cors');

const app = express();

// CORS simple para testing
app.use(cors({
  origin: ['https://sigo-caupolican.onrender.com', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Ruta de prueba simple
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '2.0.3-test'
  });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de login de prueba
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@sigo.cl' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login exitoso',
      token: 'test-token-123',
      user: {
        id: 1,
        email: 'admin@sigo.cl',
        nombre: 'Administrador'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de prueba iniciado en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
