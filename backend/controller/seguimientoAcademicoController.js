const SeguimientoAcademicoModel = require("../models/seguimientoAcademicoModel");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');

const SeguimientoAcademicoController = {
  async crear(req, res, next) {
    try {
      const result = await SeguimientoAcademicoModel.crear(req.body);
      
      // Calcular promedio automático del estudiante
      await SeguimientoAcademicoController.calcularPromedioEstudiante(req.body.id_estudiante);
      
      res.status(201).json({ 
        message: "Seguimiento académico registrado ",
        data: result,
        promedio_actualizado: true
      });
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'seguimiento_academico',
        id_registro: result?.id || null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error(" Error al crear seguimiento académico: " + err.message);
      next(err);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const datos = await SeguimientoAcademicoModel.obtenerTodos();
      res.json(datos);
    } catch (err) {
      logger.error(
        " Error al obtener todos los seguimientos académicos: " + err.message
      );
      next(err);
    }
  },

  async obtenerPorEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const { anio } = req.query;
      const datos = await SeguimientoAcademicoModel.obtenerPorEstudiante(id, anio);
      res.json(datos);
    } catch (err) {
      logger.error(
        " Error al obtener seguimientos académicos del estudiante: " + err.message
      );
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const datos = await SeguimientoAcademicoModel.obtenerPorId(id);
      if (!datos) {
        return res.status(404).json({ error: "Seguimiento académico no encontrado" });
      }
      res.json(datos);
    } catch (err) {
      logger.error(
        " Error al obtener seguimiento académico: " + err.message
      );
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SeguimientoAcademicoModel.actualizar(id, req.body);
      res.json({ message: "Seguimiento académico actualizado ", data: result });
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error(
        " Error al actualizar seguimiento académico: " + err.message
      );
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const seguimiento = await SeguimientoAcademicoModel.obtenerPorId(id);
      await SeguimientoAcademicoModel.eliminar(id);
      
      // Recalcular promedio después de eliminar
      if (seguimiento) {
        await SeguimientoAcademicoController.calcularPromedioEstudiante(seguimiento.id_estudiante);
      }
      
      res.json({ message: "Seguimiento académico eliminado " });
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'seguimiento_academico',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (err) {
      logger.error(
        " Error al eliminar seguimiento académico: " + err.message
      );
      next(err);
    }
  },

  // Nueva función para calcular promedio automático
  async calcularPromedioEstudiante(idEstudiante) {
    try {
      const seguimientos = await SeguimientoAcademicoModel.obtenerPorEstudiante(idEstudiante);
      
      if (seguimientos.length === 0) {
        logger.info(`No hay seguimientos para calcular promedio del estudiante ${idEstudiante}`);
        return null;
      }

      // Calcular promedio usando las notas reales
      let sumaNotas = 0;
      let totalNotas = 0;
      let sumaPromediosCurso = 0;
      let totalPromediosCurso = 0;
      const asignaturasUnicas = new Set();

      seguimientos.forEach(seg => {
        // Usar la nota real, no el rendimiento
        if (seg.nota && !isNaN(seg.nota)) {
          sumaNotas += parseFloat(seg.nota);
          totalNotas++;
        }
        
        // Usar el promedio del curso
        if (seg.promedio_curso && !isNaN(seg.promedio_curso)) {
          sumaPromediosCurso += parseFloat(seg.promedio_curso);
          totalPromediosCurso++;
        }
        
        // Contar asignaturas únicas
        if (seg.asignatura) {
          asignaturasUnicas.add(seg.asignatura);
        }
      });

      const promedioGeneral = totalNotas > 0 ? (sumaNotas / totalNotas).toFixed(1) : 0;
      const promedioCurso = totalPromediosCurso > 0 ? (sumaPromediosCurso / totalPromediosCurso).toFixed(1) : 0;

      logger.info(`Promedio calculado para estudiante ${idEstudiante}: ${promedioGeneral} (${totalNotas} notas)`);
      
      return {
        promedio_general: parseFloat(promedioGeneral),
        promedio_curso: parseFloat(promedioCurso),
        total_asignaturas: asignaturasUnicas.size,
        total_notas: totalNotas
      };
    } catch (error) {
      logger.error(`Error al calcular promedio del estudiante ${idEstudiante}:`, error);
      return null;
    }
  },

  // Nueva función para obtener estadísticas del estudiante
  async obtenerEstadisticas(req, res, next) {
    try {
      const { id } = req.params;
      const { anio } = req.query;
      
      const estadisticas = await SeguimientoAcademicoController.calcularPromedioEstudiante(id);
      const seguimientos = await SeguimientoAcademicoModel.obtenerPorEstudiante(id, anio);
      
      // Calcular estadísticas adicionales
      const asignaturas = [...new Set(seguimientos.map(s => s.asignatura).filter(a => a))];
      const notas = seguimientos.map(s => s.nota).filter(n => n && !isNaN(n));
      
      const estadisticasCompletas = {
        ...estadisticas,
        asignaturas_unicas: asignaturas.length,
        rango_notas: notas.length > 0 ? {
          min: Math.min(...notas),
          max: Math.max(...notas)
        } : null,
        tendencia: SeguimientoAcademicoController.calcularTendencia(notas),
        ultima_actualizacion: new Date().toISOString()
      };

      res.json(estadisticasCompletas);
    } catch (err) {
      logger.error(" Error al obtener estadísticas: " + err.message);
      next(err);
    }
  },

  // Función auxiliar para calcular tendencia
  calcularTendencia(notas) {
    if (notas.length < 2) return 'insuficiente_datos';
    
    const mitad = Math.floor(notas.length / 2);
    const primeraMitad = notas.slice(0, mitad);
    const segundaMitad = notas.slice(-mitad);
    
    const promedioPrimera = primeraMitad.reduce((a, b) => a + b, 0) / primeraMitad.length;
    const promedioSegunda = segundaMitad.reduce((a, b) => a + b, 0) / segundaMitad.length;
    
    const diferencia = promedioSegunda - promedioPrimera;
    
    if (diferencia > 0.5) return 'mejorando';
    if (diferencia < -0.5) return 'empeorando';
    return 'estable';
  }
};

module.exports = SeguimientoAcademicoController;