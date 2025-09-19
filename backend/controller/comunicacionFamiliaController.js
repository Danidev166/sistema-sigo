const model = require("../models/comunicacionFamiliaModel");
const logger = require("../utils/logger"); // Asegúrate de tener utils/logger.js creado

const ComunicacionFamiliaController = {
  async crear(req, res, next) {
    try {
      await model.crear(req.body);
      res.status(201).json({ message: "✅ Comunicación registrada" });
    } catch (err) {
      logger.error("❌ Error al registrar comunicación: " + err.message);
      next(err);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const datos = await model.obtenerTodos();
      res.json(datos);
    } catch (err) {
      logger.error("❌ Error al obtener comunicaciones: " + err.message);
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const dato = await model.obtenerPorId(req.params.id);
      if (!dato) {
        logger.warn("⚠️ Comunicación no encontrada con ID: " + req.params.id);
        return res.status(404).json({ error: "❌ No encontrado" });
      }
      res.json(dato);
    } catch (err) {
      logger.error("❌ Error al obtener comunicación: " + err.message);
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      await model.actualizar(req.params.id, req.body);
      res.json({ message: "✅ Comunicación actualizada" });
    } catch (err) {
      logger.error("❌ Error al actualizar comunicación: " + err.message);
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      await model.eliminar(req.params.id);
      res.json({ message: "🗑️ Comunicación eliminada" });
    } catch (err) {
      logger.error("❌ Error al eliminar comunicación: " + err.message);
      next(err);
    }
  }
};

module.exports = ComunicacionFamiliaController;
