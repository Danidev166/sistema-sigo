const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');
const validateBody = require('../middleware/validateBody');
const { loginSchema } = require('../validators/authValidator');
const advancedRateLimit = require('../middleware/advancedRateLimit');

// Rate limiting estricto para autenticación
router.use(advancedRateLimit.authEndpoints(15 * 60 * 1000, 5)); // 5 intentos por 15 min

// Ruta correcta de login
router.post('/login', validateBody(loginSchema), AuthController.login);

// Recuperar contraseña: enviar código
router.post('/recuperar', AuthController.enviarCodigoRecuperacion);

// Verificar código y cambiar contraseña
router.post('/verificar-codigo', AuthController.verificarCodigoYActualizarPassword);

// Refresh token
router.post('/refresh', AuthController.refreshToken);

module.exports = router;
