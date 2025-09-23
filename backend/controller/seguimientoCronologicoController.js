const SeguimientoCronologicoModel = require('../models/seguimientoCronologicoModel');
const logger = require('../utils/logger');

const SeguimientoCronologicoController = {
  async obtenerTodos(req, res, next) {
    try {
      const data = await SeguimientoCronologicoModel.obtenerTodos();
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al obtener seguimientos cronológicos: " + error.message);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const data = await SeguimientoCronologicoModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al obtener seguimiento cronológico: " + error.message);
      next(error);
    }
  },

  async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const { fechaDesde, fechaHasta, profesional, limite } = req.query;
      const filtros = { fechaDesde, fechaHasta, profesional, limite: limite ? parseInt(limite) : null };
      const data = await SeguimientoCronologicoModel.obtenerPorEstudiante(id, filtros);
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al obtener seguimientos cronológicos del estudiante: " + error.message);
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const creado = await SeguimientoCronologicoModel.crear(req.body);
      res.status(201).json({ message: 'Creado correctamente', id: creado?.id || null, data: creado });
    } catch (error) {
      logger.error("❌ Error al crear seguimiento cronológico: " + error.message);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const result = await SeguimientoCronologicoModel.actualizar(req.params.id, req.body);
      res.json({ message: 'Actualizado correctamente', data: result });
    } catch (error) {
      logger.error("❌ Error al actualizar seguimiento cronológico: " + error.message);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const result = await SeguimientoCronologicoModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente', data: result });
    } catch (error) {
      logger.error("❌ Error al eliminar seguimiento cronológico: " + error.message);
      next(error);
    }
  },

  async obtenerEstadisticas(req, res, next) {
    try {
      const data = await SeguimientoCronologicoModel.obtenerEstadisticas();
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al obtener estadísticas de seguimiento cronológico: " + error.message);
      next(error);
    }
  }
};

module.exports = SeguimientoCronologicoController;