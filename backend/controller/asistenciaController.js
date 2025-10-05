const logger = require("../utils/logger");
const AsistenciaModel = require("../models/asistenciaModel");

const AsistenciaController = {
  async crear(req, res, next) {
    try {
      const { id_estudiante, fecha, tipo, justificacion } = req.body;
      logger.info("🔍 Debug - Datos recibidos:", { id_estudiante, fecha, tipo, justificacion });
      
      const nuevaAsistencia = await AsistenciaModel.crear({ id_estudiante, fecha, tipo, justificacion });
      logger.info("✅ Debug - Asistencia creada exitosamente:", nuevaAsistencia);
      
      // Calcular estadísticas de asistencia del estudiante
      const estadisticas = await AsistenciaController.calcularEstadisticasAsistencia(id_estudiante);
      
      res.status(201).json({ 
        message: "Asistencia registrada correctamente",
        asistencia: nuevaAsistencia,
        estadisticas: estadisticas
      });
    } catch (error) {
      logger.error("❌ Error al crear asistencia:", error);
      logger.error("❌ Stack trace:", error.stack);
      
      // Manejar errores específicos
      if (error.message.includes('Ya existe un registro')) {
        return res.status(409).json({ 
          error: "Ya existe un registro de asistencia para esta fecha",
          details: error.message
        });
      }
      
      if (error.code === '23505') { // Violación de clave única
        return res.status(409).json({ 
          error: "Ya existe un registro de asistencia para esta fecha",
          details: "No se puede crear un registro duplicado"
        });
      }
      
      res.status(500).json({ 
        error: "Error interno del servidor",
        details: error.message,
        stack: error.stack
      });
    }
  },

  async obtenerTodos(_req, res, next) {
    try {
      const asistencias = await AsistenciaModel.obtenerTodos();
      res.json(asistencias);
    } catch (error) {
      logger.error("❌ Error al obtener asistencias:", error);
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const asistencia = await AsistenciaModel.obtenerPorId(id);
      if (!asistencia) return res.status(404).json({ error: "Asistencia no encontrada" });
      res.json(asistencia);
    } catch (error) {
      logger.error("❌ Error al obtener asistencia:", error);
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { id_estudiante, fecha, tipo, justificacion } = req.body;
      await AsistenciaModel.actualizar(id, { id_estudiante, fecha, tipo, justificacion });
      res.json({ message: "Asistencia actualizada correctamente" });
    } catch (error) {
      logger.error("❌ Error al actualizar asistencia:", error);
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await AsistenciaModel.eliminar(id);
      res.json({ message: "Asistencia eliminada correctamente" });
    } catch (error) {
      logger.error("❌ Error al eliminar asistencia:", error);
      next(error);
    }
  },

  async asistenciaMensual(_req, res, next) {
    try {
      const data = await AsistenciaModel.asistenciaMensual();
      res.json(data);
    } catch (error) {
      logger.error("❌ Error al generar asistencia mensual:", error);
      next(error);
    }
  },

  // Nueva función para calcular estadísticas de asistencia
  async calcularEstadisticasAsistencia(idEstudiante, anio = null) {
    try {
      const asistencias = await AsistenciaModel.obtenerPorEstudiante(idEstudiante, anio);
      
      if (asistencias.length === 0) {
        return {
          total_registros: 0,
          porcentaje_asistencia: 0,
          presentes: 0,
          ausentes: 0,
          justificadas: 0,
          pendientes: 0,
          tendencia: 'sin_datos'
        };
      }

      const presentes = asistencias.filter(a => a.tipo === 'Presente').length;
      const ausentes = asistencias.filter(a => a.tipo === 'Ausente').length;
      const justificadas = asistencias.filter(a => a.tipo === 'Justificada').length;
      const pendientes = asistencias.filter(a => a.tipo === 'Pendiente').length;
      
      const totalValidas = presentes + justificadas;
      const porcentajeAsistencia = asistencias.length > 0 ? 
        ((totalValidas / asistencias.length) * 100).toFixed(1) : 0;

      // Calcular tendencia (últimos 10 registros vs anteriores)
      const tendencia = AsistenciaController.calcularTendenciaAsistencia(asistencias);

      return {
        total_registros: asistencias.length,
        porcentaje_asistencia: parseFloat(porcentajeAsistencia),
        presentes,
        ausentes,
        justificadas,
        pendientes,
        tendencia,
        ultima_actualizacion: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error al calcular estadísticas de asistencia para estudiante ${idEstudiante}:`, error);
      return null;
    }
  },

  // Función auxiliar para calcular tendencia de asistencia
  calcularTendenciaAsistencia(asistencias) {
    if (asistencias.length < 4) return 'insuficiente_datos';
    
    const mitad = Math.floor(asistencias.length / 2);
    const primeraMitad = asistencias.slice(0, mitad);
    const segundaMitad = asistencias.slice(-mitad);
    
    const calcularPorcentaje = (registros) => {
      const validas = registros.filter(a => a.tipo === 'Presente' || a.tipo === 'Justificada').length;
      return registros.length > 0 ? (validas / registros.length) * 100 : 0;
    };
    
    const porcentajePrimera = calcularPorcentaje(primeraMitad);
    const porcentajeSegunda = calcularPorcentaje(segundaMitad);
    
    const diferencia = porcentajeSegunda - porcentajePrimera;
    
    if (diferencia > 10) return 'mejorando';
    if (diferencia < -10) return 'empeorando';
    return 'estable';
  },

  // Nueva función para obtener estadísticas detalladas
  async obtenerEstadisticas(req, res, next) {
    try {
      const { id } = req.params;
      const { anio } = req.query;
      
      const estadisticas = await AsistenciaController.calcularEstadisticasAsistencia(id, anio);
      
      if (!estadisticas) {
        return res.status(404).json({ error: "No se encontraron datos de asistencia" });
      }

      res.json(estadisticas);
    } catch (error) {
      logger.error("❌ Error al obtener estadísticas de asistencia:", error);
      next(error);
    }
  },
};

module.exports = AsistenciaController;
