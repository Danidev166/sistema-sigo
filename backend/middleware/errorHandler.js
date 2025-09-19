// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log del error con más contexto
  logger.error('❌ Error en el servidor:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  const status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  // No exponer detalles internos en producción
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Error interno del servidor';
  }

  // Respuesta estructurada
  const response = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url
  };

  // Solo incluir stack en desarrollo
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;
