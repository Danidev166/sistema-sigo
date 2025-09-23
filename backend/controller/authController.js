const bcrypt = require("bcrypt");
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

const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_SECRET; // fallback
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      logger.info("📥 Login recibido:", { email });

      if (!email || !password) {
        return res.status(400).json({ error: "⚠️ Email y contraseña son obligatorios" });
      }

      const usuario = await buscarPorEmail(email);
      if (!usuario) return res.status(401).json({ error: "❌ Usuario no encontrado" });

      // En PG, 'estado' es 'Activo'/'Inactivo'
      if (usuario.estado && usuario.estado !== "Activo") {
        return res.status(401).json({ error: "❌ Tu cuenta está inactiva. Contacta al administrador." });
      }

      const valido = await bcrypt.compare(password, usuario.password);
      if (!valido) return res.status(401).json({ error: "❌ Contraseña incorrecta" });

      const accessToken = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES }
      );

      const refreshToken = jwt.sign(
        { id: usuario.id, email: usuario.email, type: "refresh" },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES }
      );

      logger.info("✅ Login exitoso");
      res.json({
        message: "✅ Autenticación exitosa",
        token: accessToken,
        refreshToken,
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

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "⚠️ Email es obligatorio" });
      const usuario = await buscarPorEmail(email);
      if (!usuario) return res.status(404).json({ error: "❌ Usuario no encontrado" });

      const token = crypto.randomBytes(32).toString("hex");
      const expiracion = new Date(Date.now() + 3600000); // 1h
      await guardarResetToken(email, token, expiracion);

      logger.info(`🔗 Token de reset generado para ${email}`);
      res.json({ message: "📩 Se enviaron instrucciones al correo (simulado)", resetToken: token });
    } catch (error) {
      logger.error("❌ Error en forgot password:", error);
      next(error);
    }
  }

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

  static async enviarCodigoRecuperacion(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "⚠️ Email es obligatorio" });
      const usuario = await buscarPorEmail(email);
      if (!usuario) return res.status(404).json({ error: "❌ Usuario no encontrado" });
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      const expiracion = new Date(Date.now() + 15 * 60 * 1000);
      await guardarResetToken(email, codigo, expiracion);
      await enviarCodigoRecuperacion({ to: email, codigo });
      logger.info(`🔑 Código de recuperación enviado a ${email}`);
      res.json({ message: "📩 Código enviado al correo" });
    } catch (error) {
      logger.error("❌ Error en enviarCodigoRecuperacion:", error);
      next(error);
    }
  }

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

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: "⚠️ Refresh token es requerido" });

      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      if (decoded.type && decoded.type !== "refresh") {
        return res.status(401).json({ error: "❌ Token inválido" });
      }

      const usuario = await buscarPorEmail(decoded.email);
      if (!usuario) return res.status(401).json({ error: "❌ Usuario no encontrado" });

      const newAccessToken = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES }
      );

      logger.info(`✅ Token refrescado para usuario ${usuario.email}`);
      res.json({ message: "✅ Token refrescado exitosamente", accessToken: newAccessToken });
    } catch (error) {
      logger.error("❌ Error en refresh token:", error);
      res.status(401).json({ error: "❌ Refresh token inválido o expirado" });
    }
  }
}

module.exports = AuthController;
