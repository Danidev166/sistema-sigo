const model = require("../models/comunicacionFamiliaModel");
const logger = require("../utils/logger");
const { enviarCitacionReunion } = require("../utils/emailService");
const EstudianteModel = require("../models/estudianteModel");

const ComunicacionFamiliaController = {
  async crear(req, res, next) {
    try {
      const nuevaComunicacion = await model.crear(req.body);
      
      // Si es una citación a reunión, enviar email al apoderado
      if (req.body.tipo_comunicacion === 'Citación a Reunión' && req.body.enviar_email) {
        try {
          // Obtener datos del estudiante y apoderado
          const estudiante = await EstudianteModel.obtenerPorId(req.body.id_estudiante);
          
          if (estudiante && estudiante.email_apoderado) {
            await enviarCitacionReunion({
              to: estudiante.email_apoderado,
              apoderado: estudiante.nombre_apoderado || 'Apoderado',
              estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
              fecha: req.body.fecha_comunicacion,
              hora: req.body.hora_reunion || 'Por confirmar',
              lugar: req.body.lugar_reunion || 'Liceo Técnico SIGO',
              motivo: req.body.asunto || 'Reunión de seguimiento académico',
              profesional: req.body.responsable_id || 'Orientador/a'
            });
            
            logger.info(`📧 Email de citación enviado a: ${estudiante.email_apoderado}`);
          } else {
            logger.warn(`⚠️ No se pudo enviar email: estudiante sin email de apoderado`);
          }
        } catch (emailError) {
          logger.error("❌ Error enviando email de citación:", emailError);
          // No fallar la operación principal por error de email
        }
      }
      
      res.status(201).json({ 
        message: "✅ Comunicación registrada", 
        comunicacion: nuevaComunicacion 
      });
    } catch (err) {
      logger.error("❌ Error al registrar comunicación: " + err.message);
      next(err);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const { id_estudiante } = req.query;
      
      let datos;
      if (id_estudiante) {
        datos = await model.obtenerPorEstudiante(id_estudiante);
      } else {
        datos = await model.obtenerTodos();
      }
      
      res.json(datos);
    } catch (err) {
      logger.error("❌ Error al obtener comunicaciones: " + err.message);
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      // El middleware ya verificó que existe, usar los datos del request
      res.json(req.comunicacion);
    } catch (err) {
      logger.error("❌ Error al obtener comunicación: " + err.message);
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const comunicacionActualizada = await model.actualizar(req.params.id, req.body);
      
      // Si es una citación a reunión y se solicita envío por email
      if (req.body.tipo_comunicacion === 'Citación a Reunión' && req.body.enviar_email) {
        try {
          const estudiante = await EstudianteModel.obtenerPorId(req.body.id_estudiante);
          
          if (estudiante && estudiante.email_apoderado) {
            await enviarCitacionReunion({
              to: estudiante.email_apoderado,
              apoderado: estudiante.nombre_apoderado || 'Apoderado',
              estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
              fecha: req.body.fecha_comunicacion,
              hora: req.body.hora_reunion || 'Por confirmar',
              lugar: req.body.lugar_reunion || 'Liceo Técnico SIGO',
              motivo: req.body.asunto || 'Reunión de seguimiento académico',
              profesional: req.body.responsable_id || 'Orientador/a'
            });
            
            logger.info(`📧 Email de citación actualizada enviado a: ${estudiante.email_apoderado}`);
          }
        } catch (emailError) {
          logger.error("❌ Error enviando email de citación actualizada:", emailError);
        }
      }
      
      res.json({ 
        message: "✅ Comunicación actualizada", 
        comunicacion: comunicacionActualizada 
      });
    } catch (err) {
      logger.error("❌ Error al actualizar comunicación: " + err.message);
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      const comunicacionEliminada = await model.eliminar(req.params.id);
      res.json({ 
        message: "🗑️ Comunicación eliminada",
        comunicacion: comunicacionEliminada
      });
    } catch (err) {
      logger.error("❌ Error al eliminar comunicación: " + err.message);
      next(err);
    }
  }
};

module.exports = ComunicacionFamiliaController;
