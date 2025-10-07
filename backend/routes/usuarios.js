const express = require("express");
const router = express.Router();
const UsuarioController = require("../controller/usuarioController");
const verifyToken = require("../middleware/verifyToken");
const {
  validarCreacionUsuario,
  validarActualizacionUsuario
} = require("../middleware/usuariosValidatorMiddleware");
const logger = require("../utils/logger");
const advancedRateLimit = require("../middleware/advancedRateLimit");

// Middleware de logging para acciones sensibles
const logSensitiveAction = (action) => (req, res, next) => {
  const userId = req.user?.id;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  logger.info(`🔐 ${action} usuario`, {
    usuario: userId,
    ip,
    userAgent,
    targetUserId: req.params.id,
    timestamp: new Date().toISOString()
  });
  
  next();
};

// 🔐 proteger todo
router.use(verifyToken);

// Rate limiting específico para usuarios
router.use(advancedRateLimit.perUser(15 * 60 * 1000, 50)); // 50 requests por 15 min por usuario

router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.obtener);
router.post("/", logSensitiveAction("CREAR"), validarCreacionUsuario, UsuarioController.crear);
router.put("/:id", logSensitiveAction("ACTUALIZAR"), validarActualizacionUsuario, UsuarioController.actualizar);
router.patch("/:id/estado", logSensitiveAction("CAMBIAR_ESTADO"), UsuarioController.actualizarEstado);
router.delete("/:id", logSensitiveAction("ELIMINAR"), UsuarioController.eliminar);

module.exports = router;
