const AgendaModel = require("../models/agendaModel");
const EstudianteModel = require("../models/estudianteModel");
const logger = require("../utils/logger");
const { enviarCorreoAgenda } = require("../utils/emailService");
const LogsActividadModel = require('../models/logsActividadModel');

class AgendaController {
  static async obtenerTodos(req, res, next) {
    try {
      const { tipo, curso, fecha_inicio, fecha_fin, estado } = req.query;
      
      logger.info("📅 Obteniendo agenda con filtros:", { tipo, curso, fecha_inicio, fecha_fin, estado });
      
      // Por ahora, ignorar los filtros y devolver todos los datos
      // TODO: Implementar filtros en el modelo
      const agenda = await AgendaModel.obtenerTodos();
      
      logger.info(`📅 Agenda obtenida: ${agenda.length} registros`);
      
      // Devolver directamente el array como antes
      res.json(agenda);
    } catch (error) {
      logger.error("❌ Error al obtener agenda:", error);
      next(error);
    }
  }

  static async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const item = await AgendaModel.obtenerPorId(id);
      if (!item) return res.status(404).json({ error: "No encontrada" });
      res.json(item);
    } catch (error) {
      logger.error("❌ Error al obtener agenda por ID:", error);
      next(error);
    }
  }

  static async crear(req, res, next) {
    try {
      const nuevaAgenda = await AgendaModel.crear(req.body);
      const estudiante = await EstudianteModel.obtenerPorId(req.body.id_estudiante);

      // 🆕 CREAR REGISTRO DE ASISTENCIA AUTOMÁTICAMENTE
      try {
        const AsistenciaModel = require('../models/asistenciaModel');
        
        // Verificar si ya existe una asistencia para esta fecha y estudiante
        const { getPool } = require('../config/db');
        const pool = await getPool();
        const existingAsistencia = await pool.raw.query(`
          SELECT id FROM asistencia 
          WHERE id_estudiante = $1 AND fecha = $2
        `, [req.body.id_estudiante, req.body.fecha]);
        
        if (existingAsistencia.rows.length === 0) {
          await AsistenciaModel.crear({
            id_estudiante: req.body.id_estudiante,
            fecha: req.body.fecha,
            tipo: 'Pendiente', // Estado inicial
            justificacion: `Cita agendada: ${req.body.motivo} - ${req.body.profesional}`
          });
          logger.info(`📋 Registro de asistencia creado automáticamente para agenda ID ${nuevaAgenda.id}`);
        } else {
          logger.info(`📋 Ya existe asistencia para esta fecha, no se crea duplicado`);
        }
      } catch (asistenciaError) {
        logger.warn(`⚠️ Error al crear asistencia automática: ${asistenciaError.message}`);
        // No fallar la creación de agenda por error en asistencia
      }

      logger.info(`📅 Entrevista agendada por ${req.user?.email || "usuario desconocido"} para estudiante ID ${req.body.id_estudiante}`);

      if (!estudiante?.email) {
        logger.warn(`⚠️ El estudiante ${req.body.id_estudiante} no tiene correo registrado`);
      } else {
        await enviarCorreoAgenda({
          to: estudiante.email,
          estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
          fecha: req.body.fecha,
          hora: req.body.hora,
          motivo: req.body.motivo,
          profesional: req.body.profesional,
          cc: req.body.email_orientador || null
        });

        logger.info(`✉️ Simulación de correo enviada a: ${estudiante.email} (copiado: ${req.body.email_orientador || "N/A"})`);
      }

      res.status(201).json({ message: "✅ Agenda creada", agenda: nuevaAgenda });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'agenda',
        id_registro: nuevaAgenda.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nuevaAgenda),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al crear agenda:", error);
      next(error);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      // Obtener datos anteriores
      const agendaAnterior = await AgendaModel.obtenerPorId(id);
      await AgendaModel.actualizar(id, req.body);
      logger.info(`✏️ Agenda ID ${id} actualizada por ${req.user?.email || "usuario desconocido"}`);
      res.json({ message: "✅ Agenda actualizada" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'agenda',
        id_registro: id,
        datos_anteriores: JSON.stringify(agendaAnterior),
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al actualizar agenda:", error);
      next(error);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      // Obtener datos anteriores
      const agendaAnterior = await AgendaModel.obtenerPorId(id);
      await AgendaModel.eliminar(id);
      logger.info(`🗑️ Agenda ID ${id} eliminada por ${req.user?.email || "usuario desconocido"}`);
      res.json({ message: "✅ Agenda eliminada" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'agenda',
        id_registro: id,
        datos_anteriores: JSON.stringify(agendaAnterior),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("❌ Error al eliminar agenda:", error);
      next(error);
    }
  }
}

module.exports = AgendaController;
