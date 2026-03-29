// backend/controller/reportesMejoradoController.js
const { getPool } = require('../config/db');
const logger = require("../utils/logger");

class ReportesMejoradoController {
  
  //  Dashboard principal
  static async dashboard(req, res, next) {
    try {
      const pool = await getPool();
      // Usar la función de la base de datos que devuelve el formato correcto
      const result = await pool.request().query('SELECT get_dashboard_final() as data');

      if (!result.recordset || result.recordset.length === 0 || !result.recordset[0].data) {
        // Fallback si la función devuelve nulo o no existe
        return res.json({
          stats: {
            total_estudiantes: 0,
            estudiantes_activos: 0,
            entrevistas_mes: 0,
            intervenciones_activas: 0,
            alertas_pendientes: 0,
            asistencia_promedio: 0
          },
          recent_activity: [],
          charts: { asistencia_mensual: [] }
        });
      }
      
      res.json(result.recordset[0].data);
      
    } catch (error) {
      logger.error(" Error en dashboard:", error);
      // Enviar respuesta amigable en lugar de 500 si es posible
      res.status(200).json({
        stats: { total_estudiantes: 0, estudiantes_activos: 0, entrevistas_mes: 0, intervenciones_activas: 0, alertas_pendientes: 0, asistencia_promedio: 0 },
        recent_activity: [],
        charts: { asistencia_mensual: [] },
        error: "Dashboard en mantenimiento (ejecute la restauración integral)"
      });
    }
  }
  
  //  Reporte de Estudiantes por Curso
  static async estudiantesPorCurso(req, res, next) {
    try {
      const { curso, estado, fecha_desde, fecha_hasta } = req.query;
      const pool = await getPool();
      const request = pool.request();
      
      let query = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          e.especialidad,
          e.situacion_economica,
          e.fecha_nacimiento,
          e.fecha_registro,
          e.email,
          e.telefono,
          e.direccion,
          e.nombre_apoderado,
          e.telefono_apoderado,
          e.email_apoderado,
          COALESCE(ha.promedio_general, 0) as promedio_general,
          COALESCE(
            (SELECT ROUND(
              ((COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0)) * 100)::numeric, 2
            ) FROM asistencia a 
            WHERE a.id_estudiante = e.id 
            AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as asistencia_porcentaje,
          (SELECT COUNT(*) FROM entrevistas ent WHERE ent.id_estudiante = e.id) as entrevistas_count,
          (SELECT COUNT(*) FROM intervenciones i WHERE i.id_estudiante = e.id) as intervenciones_count,
          (SELECT COUNT(*) FROM entrega_recursos er WHERE er.id_estudiante = e.id) as recursos_entregados
        FROM estudiantes e
        LEFT JOIN historial_academico ha ON e.id = ha.id_estudiante
        WHERE 1=1
      `;
      
      if (curso) {
        query += ` AND e.curso = @curso`;
        request.input('curso', curso);
      }
      if (estado) {
        query += ` AND e.estado = @estado`;
        request.input('estado', estado);
      }
      if (fecha_desde) {
        query += ` AND e.fecha_registro >= @fecha_desde`;
        request.input('fecha_desde', fecha_desde);
      }
      if (fecha_hasta) {
        query += ` AND e.fecha_registro <= @fecha_hasta`;
        request.input('fecha_hasta', fecha_hasta);
      }
      
      query += ` ORDER BY e.curso, asistencia_porcentaje DESC`;
      
      const result = await request.query(query);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error(" Error en estudiantesPorCurso:", error);
      next(error);
    }
  }

  //  Reporte Institucional
  static async reporteInstitucional(req, res, next) {
    try {
      const pool = await getPool();
      const sql = `
        SELECT 
          e.curso,
          COUNT(DISTINCT e.id) as total_estudiantes,
          COUNT(DISTINCT CASE WHEN e.estado = 'Activo' THEN e.id END) as estudiantes_activos,
          COUNT(DISTINCT CASE WHEN e.estado = 'Inactivo' THEN e.id END) as estudiantes_inactivos,
          COUNT(DISTINCT ent.id) as entrevistas_realizadas,
          COUNT(DISTINCT i.id) as intervenciones_activas,
          COALESCE(
            ROUND(AVG(
              (SELECT (COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float /
                 NULLIF(COUNT(*), 0)) * 100
              FROM asistencia a
              WHERE a.id_estudiante = e.id 
              AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
              )
            )::numeric, 2), 0
          ) as promedio_asistencia
        FROM estudiantes e
        LEFT JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN intervenciones i ON e.id = i.id_estudiante
        GROUP BY e.curso
        ORDER BY e.curso
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error(" Error en reporteInstitucional:", error);
      next(error);
    }
  }

  //  Reporte de Asistencia Detallado
  static async reporteAsistencia(req, res, next) {
    try {
      const { curso, fecha_desde, fecha_hasta } = req.query;
      const pool = await getPool();
      const request = pool.request();
      
      let query = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          COALESCE(
            (SELECT ROUND(
              ((COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0)) * 100)::numeric, 2
            ) FROM asistencia a 
            WHERE a.id_estudiante = e.id 
            AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as asistencia_porcentaje,
          COALESCE(
            (SELECT COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)
             FROM asistencia a 
             WHERE a.id_estudiante = e.id 
             AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as dias_presentes,
          COALESCE(
            (SELECT COUNT(CASE WHEN a.tipo IN ('Ausente', 'Justificada') THEN 1 END)
             FROM asistencia a 
             WHERE a.id_estudiante = e.id 
             AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as dias_ausentes
        FROM estudiantes e
        WHERE 1=1
      `;
      
      if (curso) {
        query += ` AND e.curso = @curso`;
        request.input('curso', curso);
      }
      if (fecha_desde) {
        query += ` AND e.fecha_registro >= @fecha_desde`;
        request.input('fecha_desde', fecha_desde);
      }
      if (fecha_hasta) {
        query += ` AND e.fecha_registro <= @fecha_hasta`;
        request.input('fecha_hasta', fecha_hasta);
      }
      
      query += ` ORDER BY e.curso, asistencia_porcentaje DESC`;
      
      const result = await request.query(query);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error(" Error en reporteAsistencia:", error);
      next(error);
    }
  }

  //  Gráfico de Asistencia Mensual
  static async graficoAsistenciaMensual(req, res, next) {
    try {
      const pool = await getPool();
      const sql = `
        SELECT 
          EXTRACT(MONTH FROM fecha) as mes,
          EXTRACT(YEAR FROM fecha) as año,
          COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
          COUNT(CASE WHEN tipo = 'Ausente' THEN 1 END) as ausentes,
          COUNT(CASE WHEN tipo = 'Justificada' THEN 1 END) as justificadas,
          COUNT(*) as total
        FROM asistencia
        WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY EXTRACT(MONTH FROM fecha), EXTRACT(YEAR FROM fecha)
        ORDER BY mes
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error(" Error en graficoAsistenciaMensual:", error);
      next(error);
    }
  }

  //  Gráfico de Motivos de Entrevistas
  static async graficoMotivosEntrevistas(req, res, next) {
    try {
      const pool = await getPool();
      const sql = `
        SELECT 
          motivo,
          COUNT(*) as cantidad
        FROM entrevistas
        WHERE motivo IS NOT NULL
        GROUP BY motivo
        ORDER BY cantidad DESC
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error(" Error en graficoMotivosEntrevistas:", error);
      next(error);
    }
  }
}

module.exports = ReportesMejoradoController;
