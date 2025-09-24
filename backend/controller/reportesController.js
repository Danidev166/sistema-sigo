// backend/controller/reportesController.js
const { Pool } = require('pg');
const logger = require("../utils/logger");

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(renderConfig);

const esc = (v) => String(v).replace(/'/g, "''");

class ReportesController {
  static async resumenEstudiante(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido" });

      const sql = `
        SELECT e.nombre, e.apellido,
               COUNT(a.id)::int AS total_asistencias,
               ROUND(AVG(h.promedio_general)::numeric, 2) AS promedio,
               COUNT(er.id)::int AS entregas
        FROM estudiantes e
        LEFT JOIN asistencia a          ON e.id = a.id_estudiante
        LEFT JOIN historial_academico h ON e.id = h.id_estudiante
        LEFT JOIN entrega_recursos er   ON e.id = er.id_estudiante
        WHERE e.id = $1
        GROUP BY e.nombre, e.apellido
      `;
      
      const result = await pool.query(sql, [id]);
      if (!result.rows.length) return res.status(404).json({ error: "Estudiante no encontrado o sin datos" });
      res.json(result.rows[0]);
    } catch (error) {
      logger.error("❌ Error en resumenEstudiante:", error);
      next(error);
    }
  }

  static async reporteGeneral(_req, res, next) {
    try {
      const detalleSql = `
        SELECT e.id, e.nombre, e.apellido,
               COUNT(DISTINCT a.id)::int    AS asistencias,
               ROUND(AVG(h.promedio_general)::numeric, 2) AS promedio,
               COUNT(DISTINCT er.id)::int   AS entregas
        FROM estudiantes e
        LEFT JOIN asistencia a          ON e.id = a.id_estudiante
        LEFT JOIN historial_academico h ON e.id = h.id_estudiante
        LEFT JOIN entrega_recursos er   ON e.id = er.id_estudiante
        GROUP BY e.id, e.nombre, e.apellido
      `;
      const entrevistasSql = `SELECT COUNT(*)::int AS total FROM entrevistas`;
      
      const [detalle, entrevistas] = await Promise.all([
        pool.query(detalleSql),
        pool.query(entrevistasSql),
      ]);
      
      res.json({
        totalEntrevistas: entrevistas.rows[0].total,
        estudiantesActivos: detalle.rows.length,
        estudiantes: detalle.rows,
      });
    } catch (error) {
      logger.error("❌ Error en reporteGeneral:", error);
      next(error);
    }
  }

  static async asistenciaMensual(_req, res, next) {
    try {
      const sql = `
        SELECT 
          EXTRACT(MONTH FROM fecha) as mes,
          COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
          COUNT(CASE WHEN tipo = 'Ausente' THEN 1 END) as ausentes,
          COUNT(*) as total
        FROM asistencia
        WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY EXTRACT(MONTH FROM fecha)
        ORDER BY mes
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en asistenciaMensual:", error);
      next(error);
    }
  }

  static async motivosEntrevistas(_req, res, next) {
    try {
      const sql = `
        SELECT motivo, COUNT(*) as cantidad
        FROM entrevistas
        WHERE motivo IS NOT NULL
        GROUP BY motivo
        ORDER BY cantidad DESC
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en motivosEntrevistas:", error);
      next(error);
    }
  }

  static async reporteDerivaciones(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional, estado } = req.query;
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado as estado_estudiante,
          ent.fecha_entrevista,
          ent.motivo,
          ent.observaciones,
          ent.estado as estado_entrevista,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido
        FROM estudiantes e
        INNER JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN usuarios u ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      if (fecha_inicio) {
        paramCount++;
        sql += ` AND ent.fecha_entrevista >= $${paramCount}`;
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        paramCount++;
        sql += ` AND ent.fecha_entrevista <= $${paramCount}`;
        params.push(fecha_fin);
      }
      if (motivo) {
        paramCount++;
        sql += ` AND ent.motivo ILIKE $${paramCount}`;
        params.push(`%${motivo}%`);
      }
      if (profesional) {
        paramCount++;
        sql += ` AND (u.nombre ILIKE $${paramCount} OR u.apellido ILIKE $${paramCount})`;
        params.push(`%${profesional}%`);
        params.push(`%${profesional}%`);
      }
      if (estado) {
        paramCount++;
        sql += ` AND e.estado = $${paramCount}`;
        params.push(estado);
      }
      
      sql += ` ORDER BY ent.fecha_entrevista DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteDerivaciones:", error);
      next(error);
    }
  }

  static async reporteEstudiantesAtendidos(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          ent.fecha_entrevista,
          ent.motivo,
          ent.observaciones,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido,
          COUNT(ent.id) as cantidad_sesiones
        FROM estudiantes e
        INNER JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN usuarios u ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      if (fecha_inicio) {
        paramCount++;
        sql += ` AND ent.fecha_entrevista >= $${paramCount}`;
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        paramCount++;
        sql += ` AND ent.fecha_entrevista <= $${paramCount}`;
        params.push(fecha_fin);
      }
      if (motivo) {
        paramCount++;
        sql += ` AND ent.motivo ILIKE $${paramCount}`;
        params.push(`%${motivo}%`);
      }
      if (profesional) {
        paramCount++;
        sql += ` AND (u.nombre ILIKE $${paramCount} OR u.apellido ILIKE $${paramCount})`;
        params.push(`%${profesional}%`);
        params.push(`%${profesional}%`);
      }
      
      sql += ` GROUP BY e.id, e.nombre, e.apellido, e.rut, e.curso, e.estado, ent.fecha_entrevista, ent.motivo, ent.observaciones, u.nombre, u.apellido`;
      sql += ` ORDER BY e.curso, ent.fecha_entrevista DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteEstudiantesAtendidos:", error);
      next(error);
    }
  }

  static async reporteEntrevistasSeguimientos(req, res, next) {
    try {
      const { fecha_desde, fecha_hasta, curso } = req.query;
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.curso,
          ent.fecha_entrevista,
          ent.motivo,
          ent.observaciones as entrevista_obs,
          sp.fecha as fecha_seguimiento,
          sp.observaciones as seguimiento_obs,
          sp.tipo as tipo_seguimiento,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido
        FROM estudiantes e
        LEFT JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN seguimiento_psicosocial sp ON e.id = sp.id_estudiante
        LEFT JOIN usuarios u ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (fecha_desde) {
        paramCount++;
        sql += ` AND (ent.fecha_entrevista >= $${paramCount} OR sp.fecha >= $${paramCount})`;
        params.push(fecha_desde);
      }
      if (fecha_hasta) {
        paramCount++;
        sql += ` AND (ent.fecha_entrevista <= $${paramCount} OR sp.fecha <= $${paramCount})`;
        params.push(fecha_hasta);
      }
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      
      sql += ` ORDER BY e.curso, ent.fecha_entrevista DESC, sp.fecha DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteEntrevistasSeguimientos:", error);
      next(error);
    }
  }

  static async reporteSituacionesRiesgo(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, tipo_riesgo } = req.query;
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          a.fecha_alerta,
          a.tipo_alerta,
          a.descripcion,
          a.estado as estado_alerta,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido
        FROM estudiantes e
        INNER JOIN alertas a ON e.id = a.id_estudiante
        LEFT JOIN usuarios u ON a.id_profesional = u.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      if (fecha_inicio) {
        paramCount++;
        sql += ` AND a.fecha_alerta >= $${paramCount}`;
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        paramCount++;
        sql += ` AND a.fecha_alerta <= $${paramCount}`;
        params.push(fecha_fin);
      }
      if (tipo_riesgo) {
        paramCount++;
        sql += ` AND a.tipo_alerta ILIKE $${paramCount}`;
        params.push(`%${tipo_riesgo}%`);
      }
      
      sql += ` ORDER BY a.fecha_alerta DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteSituacionesRiesgo:", error);
      next(error);
    }
  }

  static async reporteAsistenciaCitaciones(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin } = req.query;
      
      let sql = `
        SELECT 
          e.id,
          e.nombre,
          e.apellido,
          e.rut,
          e.curso,
          e.estado,
          ag.fecha,
          ag.hora,
          ag.motivo,
          ag.profesional,
          ag.email_orientador,
          ag.creado_en
        FROM estudiantes e
        INNER JOIN agenda ag ON e.id = ag.id_estudiante
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      if (fecha_inicio) {
        paramCount++;
        sql += ` AND ag.fecha >= $${paramCount}`;
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        paramCount++;
        sql += ` AND ag.fecha <= $${paramCount}`;
        params.push(fecha_fin);
      }
      
      sql += ` ORDER BY ag.fecha DESC, ag.hora DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteAsistenciaCitaciones:", error);
      next(error);
    }
  }

  static async reporteGeneralPorCurso(req, res, next) {
    try {
      const sql = `
        SELECT 
          e.curso,
          COUNT(DISTINCT e.id) as total_estudiantes,
          COUNT(DISTINCT CASE WHEN e.estado = 'Activo' THEN e.id END) as estudiantes_activos,
          COUNT(DISTINCT CASE WHEN e.estado = 'Inactivo' THEN e.id END) as estudiantes_inactivos,
          COUNT(DISTINCT ent.id) as total_entrevistas,
          COUNT(DISTINCT sp.id) as total_seguimientos,
          COUNT(DISTINCT a.id) as total_alertas,
          ROUND(AVG(ha.promedio_general)::numeric, 2) as promedio_general
        FROM estudiantes e
        LEFT JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN seguimiento_psicosocial sp ON e.id = sp.id_estudiante
        LEFT JOIN alertas a ON e.id = a.id_estudiante
        LEFT JOIN historial_academico ha ON e.id = ha.id_estudiante
        GROUP BY e.curso
        ORDER BY e.curso
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteGeneralPorCurso:", error);
      next(error);
    }
  }

  static async reporteEstadisticasGlobales(req, res, next) {
    try {
      const sql = `
        SELECT 
          'estudiantes' as categoria,
          COUNT(*) as total
        FROM estudiantes
        UNION ALL
        SELECT 
          'entrevistas' as categoria,
          COUNT(*) as total
        FROM entrevistas
        UNION ALL
        SELECT 
          'seguimientos' as categoria,
          COUNT(*) as total
        FROM seguimiento_psicosocial
        UNION ALL
        SELECT 
          'alertas' as categoria,
          COUNT(*) as total
        FROM alertas
        UNION ALL
        SELECT 
          'recursos' as categoria,
          COUNT(*) as total
        FROM recursos
        UNION ALL
        SELECT 
          'usuarios' as categoria,
          COUNT(*) as total
        FROM usuarios
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteEstadisticasGlobales:", error);
      next(error);
    }
  }

  static async generarPDF(_req, res, next) {
    try {
      // Implementación básica para generar PDF
      res.json({ 
        message: "Generación de PDF no implementada aún",
        status: "pending"
      });
    } catch (error) {
      logger.error("❌ Error en generarPDF:", error);
      next(error);
    }
  }
}

module.exports = ReportesController;