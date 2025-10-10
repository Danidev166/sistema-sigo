// Controlador para manejo de promoción de estudiantes
const PromocionModel = require('../models/promocionModel');
const logger = require('../utils/logger');

class PromocionController {
  // Obtener reporte de promoción por curso
  static async obtenerReportePromocion(req, res, next) {
    try {
      const { curso, anio } = req.query;
      
      if (!curso || !anio) {
        return res.status(400).json({
          error: 'Se requieren los parámetros curso y anio'
        });
      }

      const reporte = await PromocionModel.obtenerReportePromocion(curso, anio);
      
      logger.info(`Reporte de promoción generado para ${curso} - ${anio}`);
      res.json(reporte);
      
    } catch (error) {
      logger.error('Error al obtener reporte de promoción', error);
      next(error);
    }
  }

  // Obtener estudiantes que requieren decisión manual
  static async obtenerEstudiantesPendientes(req, res, next) {
    try {
      const { curso, anio } = req.query;
      
      if (!curso || !anio) {
        return res.status(400).json({
          error: 'Se requieren los parámetros curso y anio'
        });
      }

      const reporte = await PromocionModel.obtenerReportePromocion(curso, anio);
      
      const pendientes = reporte.estudiantes.filter(
        est => est.criterios.estado_promocion === 'REQUIERE_DECISION'
      );
      
      res.json({
        curso,
        anio,
        total_pendientes: pendientes.length,
        estudiantes: pendientes
      });
      
    } catch (error) {
      logger.error('Error al obtener estudiantes pendientes', error);
      next(error);
    }
  }

  // Guardar decisión individual de promoción
  static async guardarDecisionIndividual(req, res, next) {
    try {
      const { estudianteId, decision, razon } = req.body;
      const usuarioId = req.user.id; // Asumiendo que tienes middleware de auth
      
      if (!estudianteId || !decision || !razon) {
        return res.status(400).json({
          error: 'Se requieren estudianteId, decision y razon'
        });
      }

      const validDecisions = ['PROMOVIDO', 'REPITE'];
      if (!validDecisions.includes(decision)) {
        return res.status(400).json({
          error: 'Decisión debe ser PROMOVIDO o REPITE'
        });
      }

      await PromocionModel.guardarDecisionPromocion(estudianteId, decision, razon, usuarioId);
      
      logger.info(`Decisión de promoción guardada para estudiante ${estudianteId}: ${decision}`);
      res.json({
        success: true,
        message: 'Decisión guardada exitosamente'
      });
      
    } catch (error) {
      logger.error('Error al guardar decisión individual', error);
      next(error);
    }
  }

  // Procesar promoción masiva
  static async procesarPromocionMasiva(req, res, next) {
    try {
      const { curso, anio, decisiones } = req.body;
      const usuarioId = req.user.id;
      
      if (!curso || !anio || !decisiones || !Array.isArray(decisiones)) {
        return res.status(400).json({
          error: 'Se requieren curso, anio y array de decisiones'
        });
      }

      // Validar decisiones
      for (const decision of decisiones) {
        if (!decision.estudianteId || !decision.nuevaPromocion || !decision.razon) {
          return res.status(400).json({
            error: 'Cada decisión debe tener estudianteId, nuevaPromocion y razon'
          });
        }
      }

      const resultado = await PromocionModel.procesarPromocionMasiva(
        curso, 
        anio, 
        decisiones.map(d => ({ ...d, usuarioId }))
      );
      
      logger.info(`Promoción masiva procesada para ${curso} - ${anio}: ${decisiones.length} decisiones`);
      res.json(resultado);
      
    } catch (error) {
      logger.error('Error al procesar promoción masiva', error);
      next(error);
    }
  }

  // Obtener estadísticas de promoción
  static async obtenerEstadisticasPromocion(req, res, next) {
    try {
      const { anio } = req.query;
      
      if (!anio) {
        return res.status(400).json({
          error: 'Se requiere el parámetro anio'
        });
      }

      // Obtener estadísticas por curso
      const cursos = ['1° MEDIO', '2° MEDIO', '3° MEDIO', '4° MEDIO'];
      const estadisticas = [];

      for (const curso of cursos) {
        const reporte = await PromocionModel.obtenerReportePromocion(curso, anio);
        estadisticas.push({
          curso,
          ...reporte.resumen,
          total_estudiantes: reporte.total_estudiantes
        });
      }

      // Calcular totales
      const totales = estadisticas.reduce((acc, cur) => {
        acc.total_estudiantes += cur.total_estudiantes;
        acc.promovidos += cur.promovidos;
        acc.repiten += cur.repiten;
        acc.requieren_decision += cur.requieren_decision;
        return acc;
      }, { total_estudiantes: 0, promovidos: 0, repiten: 0, requieren_decision: 0 });

      res.json({
        anio,
        totales,
        por_curso: estadisticas
      });
      
    } catch (error) {
      logger.error('Error al obtener estadísticas de promoción', error);
      next(error);
    }
  }

  // Exportar reporte de promoción a PDF
  static async exportarReportePDF(req, res, next) {
    try {
      const { curso, anio } = req.query;
      
      if (!curso || !anio) {
        return res.status(400).json({
          error: 'Se requieren los parámetros curso y anio'
        });
      }

      const reporte = await PromocionModel.obtenerReportePromocion(curso, anio);
      
      // Aquí implementarías la generación de PDF
      // Por ahora devolvemos el reporte en JSON
      res.json({
        success: true,
        message: 'Reporte generado exitosamente',
        reporte
      });
      
    } catch (error) {
      logger.error('Error al exportar reporte PDF', error);
      next(error);
    }
  }
}

module.exports = PromocionController;
