// backend/models/seguimientoModel.js
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

const SeguimientoModel = {
  async crear(data) {
    const query = `
      INSERT INTO seguimiento
        (id_estudiante, fecha, tipo, descripcion, profesional, subtipo, archivo, urgencias)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha || new Date(),
      data.tipo,
      data.descripcion || '',
      data.profesional || null,
      data.subtipo || null,
      data.archivo || null,
      data.urgencias || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async listar() {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha DESC, s.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  async obtenerTodos() {
    return await this.listar();
  },

  async obtenerPorId(id) {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id_estudiante = $1
      ORDER BY s.fecha DESC, s.id DESC
    `;
    
    const result = await pool.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE seguimiento
      SET id_estudiante = $1,
          fecha = $2,
          tipo = $3,
          descripcion = $4,
          profesional = $5,
          subtipo = $6,
          archivo = $7,
          urgencias = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha || new Date(),
      data.tipo,
      data.descripcion || '',
      data.profesional || null,
      data.subtipo || null,
      data.archivo || null,
      data.urgencias || null,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const query = `DELETE FROM seguimiento WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = SeguimientoModel;