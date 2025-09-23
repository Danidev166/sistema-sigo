const SeguimientoModel = require("../models/seguimientoModel");
const logger = require("../utils/logger");

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
      const datos = await SeguimientoModel.listar();
      res.json(datos);
    } catch (error) {
      logger.error("❌ Error al listar seguimientos: " + error.message);
      next(error);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const datos = await SeguimientoModel.obtenerTodos();
      res.json(datos);
    } catch (error) {
      logger.error("❌ Error al obtener todos los seguimientos: " + error.message);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const datos = await SeguimientoModel.obtenerPorId(id);
      if (!datos) {
        return res.status(404).json({ error: "Seguimiento no encontrado" });
      }
      res.json(datos);
    } catch (error) {
      logger.error("❌ Error al obtener seguimiento: " + error.message);
      next(error);
    }
  },

  async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const datos = await SeguimientoModel.obtenerPorEstudiante(id);
      res.json(datos);
    } catch (error) {
      logger.error("❌ Error al obtener seguimientos del estudiante: " + error.message);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SeguimientoModel.actualizar(id, req.body);
      res.json({ message: "Seguimiento actualizado ✅", data: result });
    } catch (error) {
      logger.error("❌ Error al actualizar seguimiento: " + error.message);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await SeguimientoModel.eliminar(id);
      res.json({ message: "Seguimiento eliminado ✅" });
    } catch (error) {
      logger.error("❌ Error al eliminar seguimiento: " + error.message);
      next(error);
    }
  }
};

module.exports = SeguimientoController;