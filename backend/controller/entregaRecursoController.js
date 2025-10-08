const EntregaRecursoModel = require("../models/entregaRecursoModel");
const RecursoModel = require("../models/recursoModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

class EntregaRecursoController {
  static async obtenerTodas(req, res) {
    try {
      const entregas = await EntregaRecursoModel.obtenerTodas();
      res.json(entregas);
    } catch (error) {
      logger.error("Error al obtener entregas:", error);
      res.status(500).json({ error: "Error al obtener las entregas de recursos" });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const entrega = await EntregaRecursoModel.obtenerPorId(id);

      if (!entrega) {
        return res.status(404).json({ error: "Entrega no encontrada" });
      }

      res.json(entrega);
    } catch (error) {
      logger.error(`Error al obtener entrega ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al obtener la entrega" });
    }
  }

  static async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const entregas = await EntregaRecursoModel.obtenerPorEstudiante(id);
      res.json(entregas);
    } catch (error) {
      logger.error(" Error al obtener entregas por estudiante:", error);
      next(error);
    }
  }

  static async crear(req, res) {
    try {
      const recurso = await RecursoModel.obtenerPorId(req.body.id_recurso);
      if (!recurso) {
        return res.status(404).json({ error: "El recurso no existe" });
      }

      if (recurso.cantidad_disponible < req.body.cantidad_entregada) {
        return res.status(400).json({ error: "No hay suficiente cantidad disponible del recurso" });
      }

      const nuevaEntrega = {
        id_estudiante: req.body.id_estudiante,
        id_recurso: req.body.id_recurso,
        cantidad_entregada: req.body.cantidad_entregada,
        fecha_entrega: req.body.fecha_entrega || new Date(),
        observaciones: req.body.observaciones || ''
      };

      const entregaCreada = await EntregaRecursoModel.crear(nuevaEntrega);

      const cantidadActualizada = recurso.cantidad_disponible - req.body.cantidad_entregada;
      await RecursoModel.actualizar(req.body.id_recurso, {
        ...recurso,
        cantidad_disponible: cantidadActualizada
      });

      res.status(201).json(entregaCreada);
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'entregas',
        id_registro: entregaCreada.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(entregaCreada),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al crear entrega:", error);
      res.status(500).json({ error: "Error al crear la entrega de recurso" });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const entregaExistente = await EntregaRecursoModel.obtenerPorId(id);

      if (!entregaExistente) {
        return res.status(404).json({ error: "Entrega no encontrada" });
      }

      const datosActualizacion = {
        id_estudiante: req.body.id_estudiante,
        id_recurso: req.body.id_recurso,
        cantidad_entregada: req.body.cantidad_entregada,
        fecha_entrega: req.body.fecha_entrega,
        observaciones: req.body.observaciones
      };

      const entregaActualizada = await EntregaRecursoModel.actualizar(id, datosActualizacion);
      res.json(entregaActualizada);
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'entregas',
        id_registro: id,
        datos_anteriores: JSON.stringify(entregaExistente),
        datos_nuevos: JSON.stringify(entregaActualizada),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error(`Error al actualizar entrega ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al actualizar la entrega" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const entrega = await EntregaRecursoModel.obtenerPorId(id);

      if (!entrega) {
        return res.status(404).json({ error: "Entrega no encontrada" });
      }

      const recurso = await RecursoModel.obtenerPorId(entrega.id_recurso);
      if (recurso) {
        const cantidadActualizada = recurso.cantidad_disponible + entrega.cantidad_entregada;
        await RecursoModel.actualizar(entrega.id_recurso, {
          ...recurso,
          cantidad_disponible: cantidadActualizada
        });
      }

      await EntregaRecursoModel.eliminar(id);
      res.json({ mensaje: "Entrega eliminada correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'entregas',
        id_registro: id,
        datos_anteriores: JSON.stringify(entrega),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error(`Error al eliminar entrega ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al eliminar la entrega" });
    }
  }
}

module.exports = EntregaRecursoController;
