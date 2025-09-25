const EntrevistaModel = require("../models/entrevistaModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

class EntrevistasController {
  static async obtenerTodas(req, res, next) {
    try {
      const entrevistas = await EntrevistaModel.obtenerTodas();
      res.json(entrevistas);
    } catch (error) {
      logger.error("❌ Error al obtener entrevistas:", error);
      next(error);
    }
  }

  static async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.query;

      const entrevistas = await EntrevistaModel.obtenerPorEstudiante(id, estado || null);

      res.json(entrevistas);
    } catch (error) {
      logger.error("❌ Error al obtener entrevistas:", error);
      next(error);
    }
  }

  static async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const entrevista = await EntrevistaModel.obtenerPorId(id);
      if (!entrevista) {
        return res.status(404).json({ error: "Entrevista no encontrada" });
      }
      res.json(entrevista);
    } catch (error) {
      logger.error("❌ Error al obtener entrevista por ID:", error);
      next(error);
    }
  }
  static async obtenerPorMes(req, res, next) {
  try {
    const data = await EntrevistaModel.obtenerPorMes();
    res.json(data);
  } catch (error) {
    logger.error("❌ Error al obtener entrevistas por mes:", error);
    next(error);
  }
}

  static async obtenerPorMesTest(req, res, next) {
    try {
      const data = await EntrevistaModel.obtenerPorMes();
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al obtener entrevistas por mes (test):", error);
      next(error);
    }
  }

  static async obtenerEstadisticas(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      
      // Construir filtros
      const filtros = {};
      if (curso) filtros.curso = curso;
      if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
      if (fecha_fin) filtros.fecha_fin = fecha_fin;
      if (motivo) filtros.motivo = motivo;
      if (profesional) filtros.profesional = profesional;

      const estadisticas = await EntrevistaModel.obtenerEstadisticas(filtros);
      res.json(estadisticas);
    } catch (error) {
      logger.error("❌ Error al obtener estadísticas de entrevistas:", error);
      next(error);
    }
  }


  static async crear(req, res, next) {
    try {
      const nueva = await EntrevistaModel.crear(req.body);
      res.status(201).json({
        message: "✅ Entrevista registrada",
        entrevista: nueva,
      });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'entrevistas',
        id_registro: nueva.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nueva),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al crear entrevista:", error);
      next(error);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const entrevista = await EntrevistaModel.obtenerPorId(id);
      if (!entrevista) {
        return res.status(404).json({ error: "Entrevista no encontrada" });
      }
      await EntrevistaModel.actualizar(id, req.body);
      res.json({ message: "✅ Entrevista actualizada correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'entrevistas',
        id_registro: id,
        datos_anteriores: JSON.stringify(entrevista),
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al actualizar entrevista:", error);
      next(error);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const entrevista = await EntrevistaModel.obtenerPorId(id);
      if (!entrevista) {
        return res.status(404).json({ error: "Entrevista no encontrada" });
      }
      await EntrevistaModel.eliminar(id);
      res.json({ message: "✅ Entrevista eliminada correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'entrevistas',
        id_registro: id,
        datos_anteriores: JSON.stringify(entrevista),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al eliminar entrevista:", error);
      next(error);
    }
  }
static async registrarDesdeAgenda(req, res, next) {
  try {
    const { idAgenda } = req.params;
    const userId = req.user?.id;

    logger.info("🔍 req.user:", req.user);

    const agenda = await EntrevistaModel.obtenerAgendaPorId(idAgenda);

    logger.info("🔍 QUERY RESULT obtenerAgendaPorId:", agenda);

    if (!agenda) {
      return res.status(404).json({ error: "Agenda no encontrada" });
    }

    const { observaciones, conclusiones, acciones_acordadas } = req.body;

    const fechaStr = new Date(agenda.fecha).toISOString().split("T")[0];
    const horaStr = typeof agenda.hora === "string"
      ? agenda.hora
      : new Date(agenda.hora).toISOString().substring(11, 16);

    const fechaHora = new Date(`${fechaStr}T${horaStr}`);

    if (isNaN(fechaHora)) {
      throw new Error(`Fecha inválida: ${fechaStr}T${horaStr}`);
    }

    const entrevistaData = {
      id_estudiante: agenda.id_estudiante,
      id_orientador: userId,
      fecha_entrevista: fechaHora,
      motivo: agenda.motivo,
      observaciones: observaciones || "",
      conclusiones: conclusiones || "",
      acciones_acordadas: acciones_acordadas || "",
      estado: "realizada"
    };

    const nueva = await EntrevistaModel.crear(entrevistaData);

    await EntrevistaModel.marcarAgendaComoRealizada(idAgenda);

    res.status(201).json({
      message: "✅ Entrevista registrada desde Agenda",
      entrevista: nueva
    });

  } catch (error) {
    logger.error("❌ Error al registrar entrevista desde Agenda:", error);
    next(error);
  }
}

}

module.exports = EntrevistasController;
