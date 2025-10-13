// Script para iniciar el backend en modo desarrollo con CORS local
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando backend en modo desarrollo...');

// Configurar variables de entorno para desarrollo
process.env.NODE_ENV = 'development';
process.env.CORS_EXTRA_ORIGINS = 'http://localhost:5173,http://localhost:5174,http://localhost:5175';

// Iniciar el servidor
const server = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    CORS_EXTRA_ORIGINS: 'http://localhost:5173,http://localhost:5174,http://localhost:5175'
  }
});

server.on('error', (err) => {
  console.error('❌ Error al iniciar el servidor:', err);
});

server.on('close', (code) => {
  console.log(`🔚 Servidor cerrado con código ${code}`);
});

// Manejar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  server.kill('SIGINT');
  process.exit(0);
});
