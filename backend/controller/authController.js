const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  buscarPorEmail,
  guardarResetToken,
  buscarPorResetToken,
  actualizarPassword
} = require("../models/authModel");
const logger = require("../utils/logger");
const { enviarCodigoRecuperacion } = require("../utils/emailService");

class AuthController {
  // ✅ Login completo y con logs
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      logger.info("📥 Login recibido:", { email });

      if (!email || !password) {
        logger.warn("❌ Email o contraseña faltante");
        return res.status(400).json({ error: "⚠️ Email y contraseña son obligatorios" });
      }

      const usuario = await buscarPorEmail(email);
      if (!usuario) {
        logger.warn("❌ Usuario no encontrado");
        return res.status(401).json({ error: "❌ Usuario no encontrado" });
      }

      // Verificar si el usuario está activo
      if (!usuario.estado) {
        logger.warn("❌ Usuario inactivo intentando hacer login", { email, id: usuario.id });
        return res.status(401).json({ error: "❌ Tu cuenta está inactiva. Contacta al administrador." });
      }

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) {
        logger.warn("❌ Contraseña incorrecta");
        return res.status(401).json({ error: "❌ Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      logger.info("✅ Login exitoso");

      res.json({
        message: "✅ Autenticación exitosa",
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          email: usuario.email
        }
      });
    } catch (error) {
      logger.error("❌ Error en login:", error);
      next(error);
    }
  }

  // Forgot Password
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "⚠️ Email es obligatorio" });

      const usuario = await buscarPorEmail(email);
      if (!usuario) return res.status(404).json({ error: "❌ Usuario no encontrado" });

      const token = crypto.randomBytes(32).toString('hex');
      const expiracion = new Date(Date.now() + 3600000); // 1 hora

      await guardarResetToken(email, token, expiracion);

      logger.info(`🔗 Token de reset generado para ${email}: ${token}`);

      res.json({ message: "📩 Se enviaron instrucciones al correo (simulado)", resetToken: token });
    } catch (error) {
      logger.error("❌ Error en forgot password:", error);
      next(error);
    }
  }

  // Reset Password
  static async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, resetToken } = req.body;
      if (!newPassword || !confirmPassword || !resetToken)
        return res.status(400).json({ error: "⚠️ Todos los campos son obligatorios" });

      if (newPassword !== confirmPassword)
        return res.status(400).json({ error: "⚠️ Las contraseñas no coinciden" });

      const usuario = await buscarPorResetToken(resetToken);
      if (!usuario) return res.status(404).json({ error: "❌ Token inválido o expirado" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await actualizarPassword(usuario.id, hashedPassword);

      logger.info(`✅ Contraseña actualizada para usuario id ${usuario.id}`);

      res.json({ message: "✅ Contraseña actualizada correctamente" });
    } catch (error) {
      logger.error("❌ Error en reset password:", error);
      next(error);
    }
  }

  // Enviar código de recuperación (6 dígitos)
  static async enviarCodigoRecuperacion(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "⚠️ Email es obligatorio" });
      const usuario = await buscarPorEmail(email);
      if (!usuario) return res.status(404).json({ error: "❌ Usuario no encontrado" });
      // Generar código de 6 dígitos
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      const expiracion = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await guardarResetToken(email, codigo, expiracion);
      // Usar el servicio centralizado para enviar el código
      await enviarCodigoRecuperacion({ to: email, codigo });
      logger.info(`🔑 Código de recuperación enviado a ${email}: ${codigo}`);
      res.json({ message: "📩 Código enviado al correo" });
    } catch (error) {
      logger.error("❌ Error en enviarCodigoRecuperacion:", error);
      next(error);
    }
  }

  // Verificar código y actualizar contraseña
  static async verificarCodigoYActualizarPassword(req, res, next) {
    try {
      const { email, codigo, password } = req.body;
      if (!email || !codigo || !password)
        return res.status(400).json({ error: "⚠️ Todos los campos son obligatorios" });
      const usuario = await buscarPorEmail(email);
      if (!usuario || !usuario.reset_token || !usuario.reset_token_expiration)
        return res.status(400).json({ error: "❌ Solicita un código primero" });
      if (usuario.reset_token !== codigo)
        return res.status(400).json({ error: "❌ Código incorrecto" });
      if (new Date(usuario.reset_token_expiration) < new Date())
        return res.status(400).json({ error: "❌ Código expirado" });
      const hashedPassword = await bcrypt.hash(password, 10);
      await actualizarPassword(usuario.id, hashedPassword);
      logger.info(`✅ Contraseña actualizada para usuario id ${usuario.id}`);
      res.json({ message: "✅ Contraseña actualizada correctamente" });
    } catch (error) {
      logger.error("❌ Error en verificarCodigoYActualizarPassword:", error);
      next(error);
    }
  }

  // Refresh Token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ error: "⚠️ Refresh token es requerido" });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({ error: "❌ Token inválido" });
      }

      // Buscar usuario para verificar que aún existe
      const usuario = await buscarPorEmail(decoded.email);
      if (!usuario) {
        return res.status(401).json({ error: "❌ Usuario no encontrado" });
      }

      // Generar nuevo access token
      const newAccessToken = jwt.sign(
        { id: usuario.Id, email: usuario.CorreoElectronico, rol: usuario.Rol, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      logger.info(`✅ Token refrescado para usuario ${usuario.CorreoElectronico}`);

      res.json({
        message: "✅ Token refrescado exitosamente",
        accessToken: newAccessToken
      });
    } catch (error) {
      logger.error("❌ Error en refresh token:", error);
      res.status(401).json({ error: "❌ Refresh token inválido o expirado" });
    }
  }
}

module.exports = AuthController;
