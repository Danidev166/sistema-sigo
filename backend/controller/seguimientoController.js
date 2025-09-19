const SeguimientoModel = require("../models/seguimientoModel");
const logger = require("../utils/logger"); // ✅ Ruta corregida

const SeguimientoController = {
  async crear(req, res, next) {
    try {
      const nuevo = await SeguimientoModel.crear(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      logger.error("❌ Error al crear seguimiento: " + error.message);
      next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const lista = await SeguimientoModel.listar();
      res.json(lista);
    } catch (error) {
      logger.error("❌ Error al listar seguimientos: " + error.message);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const seguimiento = await SeguimientoModel.obtenerPorId(req.params.id);
      if (!seguimiento) {
        logger.warn("⚠️ Seguimiento no encontrado con ID: " + req.params.id);
        return res.status(404).json({ error: "Seguimiento no encontrado" });
      }
      res.json(seguimiento);
    } catch (error) {
      logger.error("❌ Error al obtener seguimiento por ID: " + error.message);
      next(error);
    }
  },

  async obtenerPorEstudiante(req, res, next) {
    try {
      const seguimientos = await SeguimientoModel.obtenerPorEstudiante(req.params.id);
      res.json(seguimientos);
    } catch (error) {
      logger.error("❌ Error al obtener seguimientos del estudiante: " + error.message);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      await SeguimientoModel.actualizar(req.params.id, req.body);
      res.json({ message: "✅ Seguimiento actualizado" });
    } catch (error) {
      logger.error("❌ Error al actualizar seguimiento: " + error.message);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await SeguimientoModel.eliminar(req.params.id);
      res.json({ message: "✅ Seguimiento eliminado" });
    } catch (error) {
      logger.error("❌ Error al eliminar seguimiento: " + error.message);
      next(error);
    }
  }
};

module.exports = SeguimientoController;
