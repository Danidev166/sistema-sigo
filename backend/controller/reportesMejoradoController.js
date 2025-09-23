// backend/controller/reportesMejoradoController.js
const { getPool } = require("../config/db");
const logger = require("../utils/logger");

class ReportesMejoradoController {
  
  // 📊 Reporte de Estudiantes por Curso
  static async estudiantesPorCurso(req, res, next) {
    try {
      const { curso, estado, fecha_desde, fecha_hasta } = req.query;
      const pool = await getPool();
      
      let sql = `
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
          '' as nombre_apoderado,
          '' as telefono_apoderado,
          '' as email_apoderado,
          -- Datos académicos reales
          COALESCE(ha.promedio_general, 0) as promedio_general,
          -- Calcular asistencia real desde la tabla asistencia
          COALESCE(
            (SELECT ROUND(
              ((COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0)) * 100)::numeric, 2
            ) FROM asistencia a 
            WHERE a.id_estudiante = e.id 
            AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as asistencia_porcentaje,
          -- conducta_promedio no existe en la tabla, usar valor por defecto
          0 as conducta_promedio,
          -- Conteos reales
          (SELECT COUNT(*) FROM entrevistas ent WHERE ent.id_estudiante = e.id) as entrevistas_count,
          (SELECT COUNT(*) FROM intervenciones i WHERE i.id_estudiante = e.id) as intervenciones_count,
          (SELECT COUNT(*) FROM entrega_recursos er WHERE er.id_estudiante = e.id) as recursos_entregados
        FROM estudiantes e
        LEFT JOIN historial_academico ha ON e.id = ha.id_estudiante
        WHERE 1=1
      `;
      
      if (curso) sql += ` AND e.curso = '${curso}'`;
      if (estado) sql += ` AND e.estado = '${estado}'`;
      if (fecha_desde) sql += ` AND e.fecha_registro >= '${fecha_desde}'`;
      if (fecha_hasta) sql += ` AND e.fecha_registro <= '${fecha_hasta}'`;
      
      sql += ` ORDER BY e.curso, e.nombre, e.apellido`;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error("❌ Error en estudiantesPorCurso:", error);
      next(error);
    }
  }

  // 📈 Reporte Institucional por Curso
  static async reporteInstitucional(req, res, next) {
    try {
      const pool = await getPool();
      
      const sql = `
        SELECT 
          e.curso,
          COUNT(*) as total_estudiantes,
          COUNT(CASE WHEN e.estado = 'activo' THEN 1 END) as estudiantes_activos,
          COUNT(CASE WHEN e.estado = 'inactivo' THEN 1 END) as estudiantes_inactivos,
          COUNT(CASE WHEN e.estado = 'egresado' THEN 1 END) as estudiantes_egresados,
          -- Calcular promedio de asistencia real
          COALESCE(
            (SELECT ROUND(AVG(porcentaje_asistencia)::numeric, 2)
            FROM (
              SELECT 
                (COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
                 NULLIF(COUNT(*), 0)) * 100 as porcentaje_asistencia
              FROM asistencia a 
              INNER JOIN estudiantes est ON a.id_estudiante = est.id
              WHERE est.curso = e.curso 
              AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
              GROUP BY a.id_estudiante
            ) as asistencia_por_estudiante
            ), 0
          ) as promedio_asistencia,
          ROUND(AVG(COALESCE(ha.promedio_general, 0))::numeric, 2) as promedio_academico,
          COUNT(CASE WHEN e.situacion_economica = 'baja' THEN 1 END) as situacion_economica_baja,
          COUNT(CASE WHEN e.situacion_economica = 'media' THEN 1 END) as situacion_economica_media,
          COUNT(CASE WHEN e.situacion_economica = 'alta' THEN 1 END) as situacion_economica_alta,
          -- Conteos de actividades
          (SELECT COUNT(*) FROM entrevistas ent 
           INNER JOIN estudiantes est ON ent.id_estudiante = est.id 
           WHERE est.curso = e.curso) as entrevistas_realizadas,
          (SELECT COUNT(*) FROM intervenciones i 
           INNER JOIN estudiantes est ON i.id_estudiante = est.id 
           WHERE est.curso = e.curso) as intervenciones_activas,
          (SELECT COUNT(*) FROM entrega_recursos er 
           INNER JOIN estudiantes est ON er.id_estudiante = est.id 
           WHERE est.curso = e.curso) as recursos_entregados
        FROM estudiantes e
        LEFT JOIN historial_academico ha ON e.id = ha.id_estudiante
        GROUP BY e.curso
        ORDER BY e.curso
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error("❌ Error en reporteInstitucional:", error);
      next(error);
    }
  }

  // 📅 Reporte de Asistencia Detallado
  static async reporteAsistencia(req, res, next) {
    try {
      const { curso, fecha_desde, fecha_hasta } = req.query;
      const pool = await getPool();
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          -- Calcular asistencia real desde la tabla asistencia
          COALESCE(
            (SELECT ROUND(
              ((COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0)) * 100)::numeric, 2
            ) FROM asistencia a 
            WHERE a.id_estudiante = e.id 
            AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ), 0
          ) as asistencia_porcentaje,
          -- Calcular días presentes y ausentes reales
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
      
      if (curso) sql += ` AND e.curso = '${curso}'`;
      if (fecha_desde) sql += ` AND e.fecha_registro >= '${fecha_desde}'`;
      if (fecha_hasta) sql += ` AND e.fecha_registro <= '${fecha_hasta}'`;
      
      sql += ` ORDER BY e.curso, asistencia_porcentaje DESC`;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error("❌ Error en reporteAsistencia:", error);
      next(error);
    }
  }

  // 📊 Dashboard con KPIs
  static async dashboardKPIs(req, res, next) {
    try {
      const pool = await getPool();
      
      const queries = {
        totalEstudiantes: "SELECT COUNT(*) as total FROM estudiantes",
        estudiantesActivos: "SELECT COUNT(*) as total FROM estudiantes WHERE estado = 'activo'",
        entrevistasMes: `
          SELECT COUNT(*) as total 
          FROM entrevistas 
          WHERE EXTRACT(MONTH FROM fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM fecha_entrevista) = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        intervencionesMes: `
          SELECT COUNT(*) as total 
          FROM intervenciones 
          WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        recursosEntregados: "SELECT COUNT(*) as total FROM entrega_recursos",
        promedioAsistencia: `
          SELECT COALESCE(ROUND(AVG(porcentaje_asistencia)::numeric, 2), 0) as promedio
          FROM (
            SELECT 
              id_estudiante,
              (COUNT(CASE WHEN tipo = 'Presente' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0)) * 100 as porcentaje_asistencia
            FROM asistencia 
            WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY id_estudiante
          ) as asistencia_por_estudiante
        `
      };
      
      const results = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await pool.request().query(query);
        results[key] = result.recordset[0].total || result.recordset[0].promedio || 0;
      }
      
      res.json(results);
      
    } catch (error) {
      logger.error("❌ Error en dashboardKPIs:", error);
      next(error);
    }
  }

  // 📈 Gráfico de Asistencia por Mes
  static async graficoAsistenciaMensual(req, res, next) {
    try {
      const pool = await getPool();
      
      const sql = `
        SELECT 
          EXTRACT(MONTH FROM fecha) as mes,
          EXTRACT(YEAR FROM fecha) as año,
          COUNT(*) as total_registros,
          COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
          COUNT(CASE WHEN tipo IN ('Ausente', 'Justificada') THEN 1 END) as ausentes,
          ROUND(
            ((COUNT(CASE WHEN tipo = 'Presente' THEN 1 END)::float / COUNT(*)) * 100)::numeric, 
            2
          ) as porcentaje_asistencia
        FROM asistencia
        WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY EXTRACT(MONTH FROM fecha), EXTRACT(YEAR FROM fecha)
        ORDER BY mes
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error("❌ Error en graficoAsistenciaMensual:", error);
      next(error);
    }
  }

  // 📊 Gráfico de Motivos de Entrevistas
  static async graficoMotivosEntrevistas(req, res, next) {
    try {
      const pool = await getPool();
      
      const sql = `
        SELECT 
          motivo,
          COUNT(*) as cantidad,
          ROUND(((COUNT(*)::float / (SELECT COUNT(*) FROM entrevistas)) * 100)::numeric, 2) as porcentaje
        FROM entrevistas
        GROUP BY motivo
        ORDER BY cantidad DESC
      `;
      
      const result = await pool.request().query(sql);
      res.json(result.recordset);
      
    } catch (error) {
      logger.error("❌ Error en graficoMotivosEntrevistas:", error);
      next(error);
    }
  }
}

module.exports = ReportesMejoradoController;
