const MovimientoModel = require("../models/movimientoModel");
const EntregaRecursoModel = require("../models/entregaRecursoModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

class MovimientoController {
  static async registrar(req, res) {
    try {
      const nuevoMovimiento = await MovimientoModel.registrar(req.body);

      // ✅ Si es una salida y tiene estudiante, registrar en Entrega_Recursos
      if (
        req.body.tipo_movimiento === "salida" &&
        req.body.id_estudiante &&
        !isNaN(parseInt(req.body.id_estudiante))
      ) {
        await EntregaRecursoModel.crear({
          id_estudiante: req.body.id_estudiante,
          id_recurso: req.body.id_recurso,
          cantidad_entregada: req.body.cantidad,
          fecha_entrega: req.body.fecha || new Date(),
          observaciones: req.body.observaciones || "",
        });

        logger.info(
          `🎁 Entrega registrada desde movimiento: recurso ${req.body.id_recurso} → estudiante ${req.body.id_estudiante}`
        );
      }

      res.status(201).json(nuevoMovimiento);
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'movimientos',
        id_registro: nuevoMovimiento.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nuevoMovimiento),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al registrar movimiento:", error);
      res.status(500).json({ error: "Error al registrar el movimiento" });
    }
  }

  static async listar(req, res) {
    try {
      const movimientos = await MovimientoModel.obtenerTodos();
      res.json(movimientos);
    } catch (error) {
      logger.error("Error al listar movimientos:", error);
      res.status(500).json({ error: "Error al obtener los movimientos" });
    }
  }
}

module.exports = MovimientoController;
