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
        (id_estudiante, asignatura, nota, promedio_curso, fecha, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.asignatura,
      data.nota,
      data.promedio_curso || null,
      data.fecha || new Date(),
      data.observaciones || ''
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      ORDER BY sa.fecha DESC, sa.id DESC
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
      query += ` AND EXTRACT(YEAR FROM sa.fecha) = $2`;
      params.push(anio);
    }
    
    query += ` ORDER BY sa.fecha DESC, sa.id DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async obtenerNotasPorEstudiante(id_estudiante, anio) {
    const query = `
      SELECT asignatura, nota, promedio_curso, fecha
      FROM seguimiento_academico
      WHERE id_estudiante = $1 AND EXTRACT(YEAR FROM fecha) = $2
      ORDER BY fecha DESC
    `;
    
    const result = await pool.query(query, [id_estudiante, anio]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE seguimiento_academico
      SET id_estudiante = $1,
          asignatura = $2,
          nota = $3,
          promedio_curso = $4,
          fecha = $5,
          observaciones = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.asignatura,
      data.nota,
      data.promedio_curso || null,
      data.fecha || new Date(),
      data.observaciones || '',
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