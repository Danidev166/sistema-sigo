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

  static async reporteEntrevistasSeguimientos(req, res, next) {
    try {
      const { fecha_desde, fecha_hasta, curso } = req.query;
      
      let sql = `
        SELECT 
          e.nombre,
          e.apellido,
          e.curso,
          ent.fecha_entrevista,
          ent.motivo,
          ent.observaciones,
          sp.fecha_seguimiento,
          sp.observaciones as seguimiento_obs
        FROM estudiantes e
        LEFT JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN seguimiento_psicosocial sp ON e.id = sp.id_estudiante
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (fecha_desde) {
        paramCount++;
        sql += ` AND (ent.fecha_entrevista >= $${paramCount} OR sp.fecha_seguimiento >= $${paramCount})`;
        params.push(fecha_desde);
      }
      if (fecha_hasta) {
        paramCount++;
        sql += ` AND (ent.fecha_entrevista <= $${paramCount} OR sp.fecha_seguimiento <= $${paramCount})`;
        params.push(fecha_hasta);
      }
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      
      sql += ` ORDER BY e.curso, ent.fecha_entrevista DESC, sp.fecha_seguimiento DESC`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      logger.error("❌ Error en reporteEntrevistasSeguimientos:", error);
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