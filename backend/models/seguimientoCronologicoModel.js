// backend/models/seguimientoCronologicoModel.js
const { Pool } = require('pg');

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

class SeguimientoCronologicoModel {
  static async crear(data) {
    const query = `
      INSERT INTO seguimiento_cronologico
        (id_estudiante, fecha, titulo, descripcion, profesional)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha || new Date(),
      data.titulo || '',
      data.descripcion || '',
      data.profesional || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async obtenerTodos() {
    const query = `
      SELECT sc.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_cronologico sc
      LEFT JOIN estudiantes e ON sc.id_estudiante = e.id
      ORDER BY sc.fecha DESC, sc.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const query = `
      SELECT sc.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_cronologico sc
      LEFT JOIN estudiantes e ON sc.id_estudiante = e.id
      WHERE sc.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async obtenerPorEstudiante(idEstudiante, filtros = {}) {
    let query = `
      SELECT sc.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_cronologico sc
      LEFT JOIN estudiantes e ON sc.id_estudiante = e.id
      WHERE sc.id_estudiante = $1
    `;
    
    const params = [idEstudiante];
    let paramIndex = 2;

    if (filtros.fechaDesde) {
      query += ` AND sc.fecha >= $${paramIndex}`;
      params.push(filtros.fechaDesde);
      paramIndex++;
    }

    if (filtros.fechaHasta) {
      query += ` AND sc.fecha <= $${paramIndex}`;
      params.push(filtros.fechaHasta);
      paramIndex++;
    }

    if (filtros.profesional) {
      query += ` AND sc.profesional ILIKE $${paramIndex}`;
      params.push(`%${filtros.profesional}%`);
      paramIndex++;
    }

    query += ` ORDER BY sc.fecha DESC, sc.id DESC`;

    if (filtros.limite) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filtros.limite);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async actualizar(id, data) {
    const query = `
      UPDATE seguimiento_cronologico
      SET id_estudiante = $1,
          fecha = $2,
          titulo = $3,
          descripcion = $4,
          profesional = $5
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha || new Date(),
      data.titulo || '',
      data.descripcion || '',
      data.profesional || null,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = `DELETE FROM seguimiento_cronologico WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_registros,
        COUNT(DISTINCT id_estudiante) as estudiantes_atendidos,
        COUNT(CASE WHEN fecha >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as registros_mes
      FROM seguimiento_cronologico
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = SeguimientoCronologicoModel;