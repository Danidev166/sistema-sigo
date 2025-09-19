const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Middleware principal: verifica token JWT
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o mal formado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded; // Asumimos que el token tiene info como { id, nombre, rol, email }

    next();
  } catch (error) {
    logger?.error?.('Error de autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Middleware adicional: valida si el usuario tiene un rol permitido
const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const rol = req.usuario?.rol;
    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  checkRole
};
