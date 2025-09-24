// backend/models/seguimientoAcademicoModel.js
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

const SeguimientoAcademicoModel = {
  async crear(data) {
    const query = `
      INSERT INTO seguimiento_academico
        (id_estudiante, rendimiento, asistencia_porcentaje, observaciones, recomendaciones, responsable_id, periodo, fecha_seguimiento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.rendimiento || null,
      data.asistencia_porcentaje || null,
      data.observaciones || '',
      data.recomendaciones || '',
      data.responsable_id || null,
      data.periodo || null,
      data.fecha_seguimiento || new Date()
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      ORDER BY sa.fecha_seguimiento DESC, sa.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      WHERE sa.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante, anio = null) {
    let query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      WHERE sa.id_estudiante = $1
    `;
    
    const params = [id_estudiante];
    
    if (anio) {
      query += ` AND EXTRACT(YEAR FROM sa.fecha_seguimiento) = $2`;
      params.push(anio);
    }
    
    query += ` ORDER BY sa.fecha_seguimiento DESC, sa.id DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async obtenerNotasPorEstudiante(id_estudiante, anio) {
    const query = `
      SELECT rendimiento, asistencia_porcentaje, observaciones, fecha_seguimiento
      FROM seguimiento_academico
      WHERE id_estudiante = $1 AND EXTRACT(YEAR FROM fecha_seguimiento) = $2
      ORDER BY fecha_seguimiento DESC
    `;
    
    const result = await pool.query(query, [id_estudiante, anio]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE seguimiento_academico
      SET id_estudiante = $1,
          rendimiento = $2,
          asistencia_porcentaje = $3,
          observaciones = $4,
          recomendaciones = $5,
          responsable_id = $6,
          periodo = $7,
          fecha_seguimiento = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.rendimiento || null,
      data.asistencia_porcentaje || null,
      data.observaciones || '',
      data.recomendaciones || '',
      data.responsable_id || null,
      data.periodo || null,
      data.fecha_seguimiento || new Date(),
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const query = `DELETE FROM seguimiento_academico WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = SeguimientoAcademicoModel;