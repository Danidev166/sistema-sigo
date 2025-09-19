const AlertasModel = require("../models/alertaModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

const AlertasController = {
  async generar(req, res, next) {
    try {
      await AlertasModel.generarAlertas();
      res.json({ message: "Alertas generadas correctamente." });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Generar',
        tabla_afectada: 'alertas',
        id_registro: null,
        datos_anteriores: null,
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al generar alertas:", error);
      next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const alertas = await AlertasModel.listarAlertas();
      res.json(alertas);
    } catch (error) {
      logger.error("❌ Error al listar alertas:", error);
      next(error);
    }
  },

  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      await AlertasModel.cambiarEstado(id, estado);
      res.json({ message: "Estado de alerta actualizado." });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'alertas',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify({ estado }),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al cambiar estado de alerta:", error);
      next(error);
    }
  },
};

module.exports = AlertasController;
