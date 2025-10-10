// Modelo para manejo de promoción de estudiantes
const { getPool } = require('../config/db');

class PromocionModel {
  // Obtener estudiantes por curso con sus datos académicos
  static async obtenerEstudiantesConDatos(curso, anio) {
    const pool = await getPool();
    
    const query = `
      SELECT 
        e.id,
        e.nombre,
        e.apellido,
        e.rut,
        e.curso,
        e.estado,
        -- Datos de asistencia
        COALESCE(a.asistencia_total, 0) as total_clases,
        COALESCE(a.asistencia_presente, 0) as clases_presente,
        COALESCE(ROUND((a.asistencia_presente::float / NULLIF(a.asistencia_total, 0) * 100), 2), 0) as porcentaje_asistencia,
        -- Datos académicos
        COALESCE(ha.promedio_anual, 0) as promedio_anual,
        COALESCE(ha.asignaturas_aprobadas, 0) as asignaturas_aprobadas,
        COALESCE(ha.asignaturas_reprobadas, 0) as asignaturas_reprobadas,
        COALESCE(ha.total_asignaturas, 0) as total_asignaturas
      FROM estudiantes e
      LEFT JOIN (
        SELECT 
          id_estudiante,
          COUNT(*) as asistencia_total,
          COUNT(CASE WHEN presente = true THEN 1 END) as asistencia_presente
        FROM asistencia 
        WHERE EXTRACT(YEAR FROM fecha) = @anio
        GROUP BY id_estudiante
      ) a ON e.id = a.id_estudiante
      LEFT JOIN (
        SELECT 
          id_estudiante,
          AVG(calificacion) as promedio_anual,
          COUNT(CASE WHEN calificacion >= 4.0 THEN 1 END) as asignaturas_aprobadas,
          COUNT(CASE WHEN calificacion < 4.0 THEN 1 END) as asignaturas_reprobadas,
          COUNT(*) as total_asignaturas
        FROM historial_academico 
        WHERE anio = @anio
        GROUP BY id_estudiante
      ) ha ON e.id = ha.id_estudiante
      WHERE e.curso = @curso AND e.estado = 'Activo'
      ORDER BY e.nombre, e.apellido
    `;
    
    const result = await pool.request()
      .input('curso', curso)
      .input('anio', anio)
      .query(query);
    
    return result.recordset;
  }

  // Calcular criterios de promoción para un estudiante
  static calcularCriteriosPromocion(estudiante) {
    const {
      promedio_anual,
      asignaturas_aprobadas,
      asignaturas_reprobadas,
      total_asignaturas,
      porcentaje_asistencia
    } = estudiante;

    const criterios = {
      // Criterio 1: Todas las asignaturas aprobadas
      todas_aprobadas: asignaturas_reprobadas === 0,
      
      // Criterio 2: 1 asignatura reprobada con promedio >= 4.5
      una_reprobada_ok: asignaturas_reprobadas === 1 && promedio_anual >= 4.5,
      
      // Criterio 3: 2 asignaturas reprobadas con promedio >= 5.0
      dos_reprobadas_ok: asignaturas_reprobadas === 2 && promedio_anual >= 5.0,
      
      // Criterio 4: Asistencia >= 85%
      asistencia_ok: porcentaje_asistencia >= 85,
      
      // Criterio 5: Asistencia < 85% (requiere decisión manual)
      asistencia_baja: porcentaje_asistencia < 85,
      
      // Criterio 6: Más de 2 asignaturas reprobadas (requiere decisión manual)
      muchas_reprobadas: asignaturas_reprobadas > 2,
      
      // Criterio 7: Promedio muy bajo (requiere decisión manual)
      promedio_muy_bajo: promedio_anual < 4.0
    };

    // Determinar estado de promoción
    let estado_promocion = 'PENDIENTE';
    let requiere_decision = false;
    let razon = '';

    if (criterios.todas_aprobadas && criterios.asistencia_ok) {
      estado_promocion = 'PROMOVIDO';
      razon = 'Cumple todos los criterios automáticamente';
    } else if (criterios.una_reprobada_ok && criterios.asistencia_ok) {
      estado_promocion = 'PROMOVIDO';
      razon = '1 asignatura reprobada con promedio >= 4.5 y asistencia >= 85%';
    } else if (criterios.dos_reprobadas_ok && criterios.asistencia_ok) {
      estado_promocion = 'PROMOVIDO';
      razon = '2 asignaturas reprobadas con promedio >= 5.0 y asistencia >= 85%';
    } else if (criterios.asistencia_baja || criterios.muchas_reprobadas || criterios.promedio_muy_bajo) {
      estado_promocion = 'REQUIERE_DECISION';
      requiere_decision = true;
      razon = 'Requiere decisión del equipo directivo';
    } else {
      estado_promocion = 'REPITE';
      razon = 'No cumple criterios de promoción';
    }

    return {
      ...criterios,
      estado_promocion,
      requiere_decision,
      razon,
      recomendacion: this.generarRecomendacion(criterios, estudiante)
    };
  }

  // Generar recomendación para casos especiales
  static generarRecomendacion(criterios, estudiante) {
    const recomendaciones = [];

    if (criterios.asistencia_baja) {
      recomendaciones.push('Revisar causas de inasistencia y considerar promoción excepcional');
    }

    if (criterios.muchas_reprobadas) {
      recomendaciones.push('Evaluar si el estudiante puede continuar en el curso siguiente');
    }

    if (criterios.promedio_muy_bajo) {
      recomendaciones.push('Considerar apoyo pedagógico adicional');
    }

    if (estudiante.porcentaje_asistencia < 70) {
      recomendaciones.push('Caso crítico: asistencia muy baja');
    }

    return recomendaciones.join('; ');
  }

  // Guardar decisión de promoción
  static async guardarDecisionPromocion(estudianteId, decision, razon, usuarioId) {
    const pool = await getPool();
    
    const query = `
      INSERT INTO decisiones_promocion 
      (id_estudiante, decision, razon, usuario_id, fecha_decision)
      VALUES (@estudianteId, @decision, @razon, @usuarioId, CURRENT_TIMESTAMP)
    `;
    
    const result = await pool.request()
      .input('estudianteId', estudianteId)
      .input('decision', decision)
      .input('razon', razon)
      .input('usuarioId', usuarioId)
      .query(query);
    
    return result.recordset;
  }

  // Obtener reporte de promoción por curso
  static async obtenerReportePromocion(curso, anio) {
    const estudiantes = await this.obtenerEstudiantesConDatos(curso, anio);
    
    const reporte = {
      curso,
      anio,
      total_estudiantes: estudiantes.length,
      resumen: {
        promovidos: 0,
        repiten: 0,
        requieren_decision: 0
      },
      estudiantes: []
    };

    for (const estudiante of estudiantes) {
      const criterios = this.calcularCriteriosPromocion(estudiante);
      
      const estudianteConCriterios = {
        ...estudiante,
        criterios
      };
      
      reporte.estudiantes.push(estudianteConCriterios);
      
      // Actualizar resumen
      if (criterios.estado_promocion === 'PROMOVIDO') {
        reporte.resumen.promovidos++;
      } else if (criterios.estado_promocion === 'REPITE') {
        reporte.resumen.repiten++;
      } else if (criterios.estado_promocion === 'REQUIERE_DECISION') {
        reporte.resumen.requieren_decision++;
      }
    }

    return reporte;
  }

  // Procesar promoción masiva
  static async procesarPromocionMasiva(curso, anio, decisiones) {
    const pool = await getPool();
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      for (const decision of decisiones) {
        const { estudianteId, nuevaPromocion, razon, usuarioId } = decision;
        
        // Guardar decisión
        await transaction.request()
          .input('estudianteId', estudianteId)
          .input('decision', nuevaPromocion)
          .input('razon', razon)
          .input('usuarioId', usuarioId)
          .query(`
            INSERT INTO decisiones_promocion 
            (id_estudiante, decision, razon, usuario_id, fecha_decision)
            VALUES (@estudianteId, @decision, @razon, @usuarioId, CURRENT_TIMESTAMP)
          `);
        
        // Actualizar curso del estudiante
        if (nuevaPromocion === 'PROMOVIDO') {
          const nuevoCurso = this.calcularNuevoCurso(curso);
          await transaction.request()
            .input('id', estudianteId)
            .input('nuevoCurso', nuevoCurso)
            .query(`
              UPDATE estudiantes 
              SET curso = @nuevoCurso, fecha_actualizacion = CURRENT_TIMESTAMP
              WHERE id = @id
            `);
        }
      }
      
      await transaction.commit();
      return { success: true, message: 'Promoción procesada exitosamente' };
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Calcular nuevo curso después de promoción
  static calcularNuevoCurso(cursoActual) {
    const niveles = {
      '1° BÁSICO': '2° BÁSICO',
      '2° BÁSICO': '3° BÁSICO',
      '3° BÁSICO': '4° BÁSICO',
      '4° BÁSICO': '5° BÁSICO',
      '5° BÁSICO': '6° BÁSICO',
      '6° BÁSICO': '7° BÁSICO',
      '7° BÁSICO': '8° BÁSICO',
      '8° BÁSICO': '1° MEDIO',
      '1° MEDIO': '2° MEDIO',
      '2° MEDIO': '3° MEDIO',
      '3° MEDIO': '4° MEDIO',
      '4° MEDIO': 'EGRESADO'
    };
    
    return niveles[cursoActual] || cursoActual;
  }
}

module.exports = PromocionModel;
