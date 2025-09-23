// backend/controllers/recursoController.js
const RecursoModel = require("../models/recursoModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

class RecursoController {
  static async obtenerTodos(req, res) {
  try {
    const recursos = await RecursoModel.obtenerTodos();

    // Adaptar la respuesta: incluir "disponible" = stock
    const recursosAdaptados = recursos.map(r => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      tipo_recurso: r.tipo_recurso,
      disponible: r.stock,       // 👈 aquí le das el nombre esperado
      activo: r.activo,
      fecha_creacion: r.fecha_creacion
    }));

    res.json(recursosAdaptados);
  } catch (error) {
    logger.error("Error al obtener recursos:", error);
    res.status(500).json({ error: "Error al obtener los recursos" });
  }
}


  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const recurso = await RecursoModel.obtenerPorId(id);
      if (!recurso) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }
      res.json(recurso);
    } catch (error) {
      logger.error(`Error al obtener recurso ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al obtener el recurso" });
    }
  }

  static async crear(req, res) {
    try {
      const nuevoRecurso = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tipo_recurso: req.body.tipo_recurso
      };
      const recursoCreado = await RecursoModel.crear(nuevoRecurso);
      res.status(201).json(recursoCreado);

      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'recursos',
        id_registro: recursoCreado.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(recursoCreado),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al crear recurso:", error);
      res.status(500).json({ error: "Error al crear el recurso" });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizacion = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tipo_recurso: req.body.tipo_recurso
      };

      // Obtener datos anteriores
      const recursoAnterior = await RecursoModel.obtenerPorId(id);
      const recursoActualizado = await RecursoModel.actualizar(id, datosActualizacion);
      if (!recursoActualizado) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }
      res.json(recursoActualizado);

      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'recursos',
        id_registro: id,
        datos_anteriores: JSON.stringify(recursoAnterior),
        datos_nuevos: JSON.stringify(recursoActualizado),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error(`Error al actualizar recurso ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al actualizar el recurso" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const recurso = await RecursoModel.obtenerPorId(id);
      if (!recurso) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }
      
      // Verificar si ya está inactivo
      if (!recurso.activo) {
        return res.status(400).json({ error: "El recurso ya está inactivo" });
      }
      
      const recursoEliminado = await RecursoModel.eliminar(id);
      res.json({ 
        mensaje: "Recurso desactivado correctamente",
        recurso: recursoEliminado
      });

      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar (Lógico)',
        tabla_afectada: 'recursos',
        id_registro: id,
        datos_anteriores: JSON.stringify(recurso),
        datos_nuevos: JSON.stringify(recursoEliminado),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error(`Error al eliminar recurso ${req.params.id}:`, error);
      res.status(500).json({ error: "Error al eliminar el recurso" });
    }
  }
}

module.exports = RecursoController;
