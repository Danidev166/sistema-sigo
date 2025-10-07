// Unificación segura con verifyToken para evitar duplicación y mantener compatibilidad
const verifyToken = require('./verifyToken');

// Middleware principal: delega en verifyToken y expone req.user y req.usuario
const authMiddleware = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    // Compatibilidad hacia atrás: algunos módulos usan req.usuario
    if (req.user && !req.usuario) {
      req.usuario = req.user;
    }
    next();
  });
};

// Middleware adicional: valida si el usuario tiene un rol permitido
const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const rol = (req.user?.rol) || (req.usuario?.rol);
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
