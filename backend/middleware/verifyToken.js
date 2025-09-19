// ✅ middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const { obtenerUsuarioPorId } = require("../models/usuarioModel");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "🚫 Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario sigue activo en la base de datos
    const usuario = await obtenerUsuarioPorId(decoded.id);
    if (!usuario || !usuario.estado) {
      return res.status(401).json({ 
        error: "🚫 Tu cuenta está inactiva. Contacta al administrador." 
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "🚫 Token inválido o expirado" });
  }
};

module.exports = verifyToken;
