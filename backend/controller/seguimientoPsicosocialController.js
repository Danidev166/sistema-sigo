const logger = require("../utils/logger");
const SeguimientoPsicosocialModel = require("../models/seguimientoPsicosocialModel");
const LogsActividadModel = require('../models/logsActividadModel');

const SeguimientoPsicosocialController = {
  async crear(req, res, next) {
    try {
      const data = req.body;
      const nuevo = await SeguimientoPsicosocialModel.crear(data);
      res.status(201).json(nuevo);
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'seguimiento_psicosocial',
        id_registro: nuevo?.id || null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nuevo),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al crear seguimiento psicosocial:", error);
      next(error);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const seguimiento = await SeguimientoPsicosocialModel.obtenerTodos();
      res.json(seguimiento);
    } catch (error) {
      logger.error("❌ Error al obtener seguimientos psicosociales:", error);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const seguimiento = await SeguimientoPsicosocialModel.obtenerPorId(id);

      if (!seguimiento) {
        return res.status(404).json({ error: "Seguimiento no encontrado" });
      }

      res.json(seguimiento);
    } catch (error) {
      logger.error("❌ Error al obtener seguimiento psicosocial:", error);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Obtener datos anteriores
      const prev = await SeguimientoPsicosocialModel.obtenerPorId(id);
      await SeguimientoPsicosocialModel.actualizar(id, data);
      res.json({ message: "Seguimiento actualizado correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'seguimiento_psicosocial',
        id_registro: id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: JSON.stringify(data),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al actualizar seguimiento psicosocial:", error);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      // Obtener datos anteriores
      const prev = await SeguimientoPsicosocialModel.obtenerPorId(id);
      await SeguimientoPsicosocialModel.eliminar(id);
      res.json({ message: "Seguimiento eliminado correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'seguimiento_psicosocial',
        id_registro: id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al eliminar seguimiento psicosocial:", error);
      next(error);
    }
  }
};

module.exports = SeguimientoPsicosocialController;
