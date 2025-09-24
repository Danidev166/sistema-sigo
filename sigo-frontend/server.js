const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar todas las rutas del cliente (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
});
