const SeguimientoAcademicoModel = require("../models/seguimientoAcademicoModel");
const logger = require("../utils/logger"); // ✅ Importar correctamente
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
      const datos = await SeguimientoAcademicoModel.obtenerPorEstudiante(
        parseInt(id),
        anio ? parseInt(anio) : null
      );

      res.json(datos);
    } catch (err) {
      logger.error(
        "❌ Error al obtener seguimientos académicos por estudiante: " +
          err.message
      );
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const dato = await SeguimientoAcademicoModel.obtenerPorId(req.params.id);
      if (!dato) {
        logger.warn(
          "⚠️ Seguimiento académico no encontrado con ID: " + req.params.id
        );
        return res.status(404).json({ error: "No encontrado" });
      }
      res.json(dato);
    } catch (err) {
      logger.error(
        "❌ Error al obtener seguimiento académico por ID: " + err.message
      );
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      // Obtener datos anteriores
      const prev = await SeguimientoAcademicoModel.obtenerPorId(req.params.id);
      await SeguimientoAcademicoModel.actualizar(req.params.id, req.body);
      res.json({ message: "Seguimiento actualizado ✅" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
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
      // Obtener datos anteriores
      const prev = await SeguimientoAcademicoModel.obtenerPorId(req.params.id);
      await SeguimientoAcademicoModel.eliminar(req.params.id);
      res.json({ message: "Seguimiento eliminado ❌" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
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
  },
};

module.exports = SeguimientoAcademicoController;
