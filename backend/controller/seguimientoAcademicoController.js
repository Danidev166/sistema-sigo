const SeguimientoAcademicoModel = require("../models/seguimientoAcademicoModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

const SeguimientoAcademicoController = {
  async crear(req, res, next) {
    try {
      const result = await SeguimientoAcademicoModel.crear(req.body);
      res.status(201).json({ message: "Seguimiento académico registrado ✅" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'seguimiento_academico',
        id_registro: result?.id || null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error("❌ Error al crear seguimiento académico: " + err.message);
      next(err);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const datos = await SeguimientoAcademicoModel.obtenerTodos();
      res.json(datos);
    } catch (err) {
      logger.error(
        "❌ Error al obtener todos los seguimientos académicos: " + err.message
      );
      next(err);
    }
  },

  async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const { anio } = req.query;
      const datos = await SeguimientoAcademicoModel.obtenerPorEstudiante(id, anio);
      res.json(datos);
    } catch (err) {
      logger.error(
        "❌ Error al obtener seguimientos académicos del estudiante: " + err.message
      );
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const datos = await SeguimientoAcademicoModel.obtenerPorId(id);
      if (!datos) {
        return res.status(404).json({ error: "Seguimiento académico no encontrado" });
      }
      res.json(datos);
    } catch (err) {
      logger.error(
        "❌ Error al obtener seguimiento académico: " + err.message
      );
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SeguimientoAcademicoModel.actualizar(id, req.body);
      res.json({ message: "Seguimiento académico actualizado ✅", data: result });
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error(
        "❌ Error al actualizar seguimiento académico: " + err.message
      );
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await SeguimientoAcademicoModel.eliminar(id);
      res.json({ message: "Seguimiento académico eliminado ✅" });
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error(
        "❌ Error al eliminar seguimiento académico: " + err.message
      );
      next(err);
    }
  }
};

module.exports = SeguimientoAcademicoController;