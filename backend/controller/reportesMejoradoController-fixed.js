// backend/controller/reportesMejoradoController.js - VERSIÓN CORREGIDA
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

class ReportesMejoradoController {
  
  // 📊 Dashboard principal - VERSIÓN CORREGIDA
  static async dashboard(req, res, next) {
    try {
      // Usar la función de la base de datos que devuelve el formato correcto
      const result = await pool.query('SELECT get_dashboard_endpoint()');
      const dashboardData = result.rows[0].get_dashboard_endpoint;
      
      res.json(dashboardData);
      
    } catch (error) {
      logger.error("❌ Error en dashboard:", error);
      next(error);
    }
  }
  
  // 📊 Reporte de Estudiantes por Curso
  static async estudiantesPorCurso(req, res, next) {
    try {
      const { curso, estado, fecha_desde, fecha_hasta } = req.query;
      
      let sql = `
        SELECT 
          e.curso,
          COUNT(*) as total_estudiantes,
          COUNT(CASE WHEN e.estado = 'Activo' THEN 1 END) as activos,
          COUNT(CASE WHEN e.estado = 'Inactivo' THEN 1 END) as inactivos
        FROM estudiantes e
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      
      if (estado) {
        paramCount++;
        sql += ` AND e.estado = $${paramCount}`;
        params.push(estado);
      }
      
      sql += ` GROUP BY e.curso ORDER BY e.curso`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
      
    } catch (error) {
      logger.error("❌ Error en estudiantesPorCurso:", error);
      next(error);
    }
  }

  // 📊 Reporte Institucional
  static async reporteInstitucional(req, res, next) {
    try {
      const sql = `
        SELECT 
          COUNT(DISTINCT e.id) as total_estudiantes,
          COUNT(DISTINCT CASE WHEN e.estado = 'Activo' THEN e.id END) as estudiantes_activos,
          COUNT(DISTINCT ent.id) as total_entrevistas,
          COUNT(DISTINCT ev.id) as total_evaluaciones,
          COUNT(DISTINCT r.id) as total_recursos,
          ROUND(AVG(ha.promedio_general)::numeric, 2) as promedio_general,
          COUNT(DISTINCT a.id) as total_asistencias
        FROM estudiantes e
        LEFT JOIN entrevistas ent ON e.id = ent.id_estudiante
        LEFT JOIN evaluaciones_vocacionales ev ON e.id = ev.id_estudiante
        LEFT JOIN recursos r ON 1=1
        LEFT JOIN historial_academico ha ON e.id = ha.id_estudiante
        LEFT JOIN asistencia a ON e.id = a.id_estudiante
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows[0]);
      
    } catch (error) {
      logger.error("❌ Error en reporteInstitucional:", error);
      next(error);
    }
  }

  // 📅 Reporte de Asistencia Detallado
  static async reporteAsistencia(req, res, next) {
    try {
      const { fecha_desde, fecha_hasta, curso } = req.query;
      
      let sql = `
        SELECT 
          e.nombre,
          e.apellido,
          e.curso,
          a.fecha,
          a.tipo,
          a.observaciones
        FROM estudiantes e
        LEFT JOIN asistencia a ON e.id = a.id_estudiante
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;
      
      if (fecha_desde) {
        paramCount++;
        sql += ` AND a.fecha >= $${paramCount}`;
        params.push(fecha_desde);
      }
      
      if (fecha_hasta) {
        paramCount++;
        sql += ` AND a.fecha <= $${paramCount}`;
        params.push(fecha_hasta);
      }
      
      if (curso) {
        paramCount++;
        sql += ` AND e.curso = $${paramCount}`;
        params.push(curso);
      }
      
      sql += ` ORDER BY a.fecha DESC, e.curso, e.apellido`;
      
      const result = await pool.query(sql, params);
      res.json(result.rows);
      
    } catch (error) {
      logger.error("❌ Error en reporteAsistencia:", error);
      next(error);
    }
  }

  // 📊 Gráfico de Asistencia Mensual
  static async graficoAsistenciaMensual(req, res, next) {
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
      logger.error("❌ Error en graficoAsistenciaMensual:", error);
      next(error);
    }
  }

  // 📊 Gráfico de Motivos de Entrevistas
  static async graficoMotivosEntrevistas(req, res, next) {
    try {
      const sql = `
        SELECT motivo, COUNT(*) as cantidad
        FROM entrevistas
        WHERE motivo IS NOT NULL
        GROUP BY motivo
        ORDER BY cantidad DESC
        LIMIT 10
      `;
      
      const result = await pool.query(sql);
      res.json(result.rows);
      
    } catch (error) {
      logger.error("❌ Error en graficoMotivosEntrevistas:", error);
      next(error);
    }
  }
}

module.exports = ReportesMejoradoController;
