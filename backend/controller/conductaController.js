const model = require("../models/conductaModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

const ConductaController = {
  // Crear conducta
  async crear(req, res, next) {
    try {
      const result = await model.crear(req.body);
      res.status(201).json({ message: "✅ Registro de conducta creado" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'conducta',
        id_registro: result?.id || null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error("❌ Error al crear conducta:", err);
      next(err);
    }
  },

  // Obtener conducta por estudiante
  async obtenerPorEstudiante(req, res) {
    const { id } = req.params;
    logger.info(`[Conducta] ID recibido: ${id}`);
    try {
      const data = await model.obtenerPorEstudiante(id);
      logger.info(`[Conducta] Resultado de la consulta: ${JSON.stringify(data)}`);
      // ✅ SIEMPRE devolver 200 con array (aunque sea vacío)
      res.json(data);
    } catch (error) {
      logger.error("❌ Error en obtenerPorEstudiante:", error);
      res.status(500).json({ message: "Error al obtener conducta" });
    }
  },

  // Obtener todas las conductas
  async obtenerTodos(req, res, next) {
    try {
      const datos = await model.obtenerTodos();
      res.json(datos);
    } catch (err) {
      logger.error("❌ Error al obtener conductas:", err);
      next(err);
    }
  },

  // Obtener conducta por ID
  async obtenerPorId(req, res, next) {
    try {
      const dato = await model.obtenerPorId(req.params.id);
      if (!dato) {
        logger.warn(`⚠️ Registro de conducta no encontrado con ID: ${req.params.id}`);
        return res.status(404).json({ error: "❌ Registro no encontrado" });
      }
      res.json(dato);
    } catch (err) {
      logger.error("❌ Error al obtener conducta por ID:", err);
      next(err);
    }
  },

  // Actualizar conducta
  async actualizar(req, res, next) {
    try {
      // Obtener datos anteriores
      const prev = await model.obtenerPorId(req.params.id);
      await model.actualizar(req.params.id, req.body);
      res.json({ message: "✅ Registro de conducta actualizado" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'conducta',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error("❌ Error al actualizar conducta:", err);
      next(err);
    }
  },

  // Eliminar conducta
  async eliminar(req, res, next) {
    try {
      // Obtener datos anteriores
      const prev = await model.obtenerPorId(req.params.id);
      await model.eliminar(req.params.id);
      res.json({ message: "🗑️ Registro de conducta eliminado" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'conducta',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error("❌ Error al eliminar conducta:", err);
      next(err);
    }
  }
};

module.exports = ConductaController;
