const { sql, poolPromise } = require("../config/db");
const logger = require("../utils/logger");
const AsistenciaModel = require("../models/asistenciaModel");  // 🚀 usamos el modelo

const AsistenciaController = {
  async crear(req, res, next) {
    try {
      const { id_estudiante, fecha, tipo, justificacion } = req.body;

      await AsistenciaModel.crear({ id_estudiante, fecha, tipo, justificacion });

      res.status(201).json({ message: "Asistencia registrada correctamente" });
    } catch (error) {
      logger.error("❌ Error al crear asistencia:", error);
      next(error);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const asistencias = await AsistenciaModel.obtenerTodos();
      res.json(asistencias);
    } catch (error) {
      logger.error("❌ Error al obtener asistencias:", error);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;

      const asistencia = await AsistenciaModel.obtenerPorId(id);

      if (!asistencia) {
        return res.status(404).json({ error: "Asistencia no encontrada" });
      }

      res.json(asistencia);
    } catch (error) {
      logger.error("❌ Error al obtener asistencia:", error);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { id_estudiante, fecha, tipo, justificacion } = req.body;

      await AsistenciaModel.actualizar(id, { id_estudiante, fecha, tipo, justificacion });

      res.json({ message: "Asistencia actualizada correctamente" });
    } catch (error) {
      logger.error("❌ Error al actualizar asistencia:", error);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;

      await AsistenciaModel.eliminar(id);

      res.json({ message: "Asistencia eliminada correctamente" });
    } catch (error) {
      logger.error("❌ Error al eliminar asistencia:", error);
      next(error);
    }
  },

  // 🚀 NUEVO — asistencia mensual PRO usando el model
  async asistenciaMensual(req, res, next) {
    try {
      const data = await AsistenciaModel.asistenciaMensual();
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al generar asistencia mensual:", error);
      next(error);
    }
  },
};

module.exports = AsistenciaController;
