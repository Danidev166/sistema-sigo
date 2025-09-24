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
        (id_estudiante, fecha_seguimiento, tipo_seguimiento, observaciones, recomendaciones, responsable_id, estado, proxima_fecha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_seguimiento || new Date(),
      data.tipo_seguimiento,
      data.observaciones || '',
      data.recomendaciones || '',
      data.responsable_id || null,
      data.estado || null,
      data.proxima_fecha || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async listar() {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
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
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `;
    
    const result = await pool.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE seguimiento
      SET id_estudiante = $1,
          fecha_seguimiento = $2,
          tipo_seguimiento = $3,
          observaciones = $4,
          recomendaciones = $5,
          responsable_id = $6,
          estado = $7,
          proxima_fecha = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_seguimiento || new Date(),
      data.tipo_seguimiento,
      data.observaciones || '',
      data.recomendaciones || '',
      data.responsable_id || null,
      data.estado || null,
      data.proxima_fecha || null,
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