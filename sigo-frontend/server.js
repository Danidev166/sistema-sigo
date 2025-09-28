import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para configurar headers correctos
app.use((req, res, next) => {
  // Configurar headers de seguridad y MIME types
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Asegurar que los archivos HTML se sirvan con el MIME type correcto
  if (req.path.endsWith('.html') || req.path === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  
  next();
});

// Sirve los archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    // Configurar MIME types específicos
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Para cualquier otra ruta, sirve el index.html de React
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
