// backend/models/seguimientoPsicosocialModel.js
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

const SeguimientoPsicosocialModel = {
  async crear(data) {
    const query = `
      INSERT INTO seguimiento_psicosocial
        (id_estudiante, fecha_seguimiento, tipo_seguimiento, observaciones, recomendaciones, profesional_id, estado, proxima_cita)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_seguimiento || new Date(),
      data.tipo_seguimiento || 'General',
      data.observaciones || '',
      data.recomendaciones || '',
      data.profesional_id || null,
      data.estado || 'Activo',
      data.proxima_cita || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_psicosocial s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_psicosocial s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_psicosocial s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id_estudiante = $1
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `;
    
    const result = await pool.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE seguimiento_psicosocial
      SET fecha_seguimiento = $1,
          tipo_seguimiento = $2,
          observaciones = $3,
          recomendaciones = $4,
          profesional_id = $5,
          estado = $6,
          proxima_cita = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      data.fecha_seguimiento || new Date(),
      data.tipo_seguimiento || 'General',
      data.observaciones || '',
      data.recomendaciones || '',
      data.profesional_id || null,
      data.estado || 'Activo',
      data.proxima_cita || null,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const query = `DELETE FROM seguimiento_psicosocial WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_seguimientos,
        COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = 'Completado' THEN 1 END) as completados,
        COUNT(CASE WHEN estado = 'En Proceso' THEN 1 END) as en_proceso
      FROM seguimiento_psicosocial
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }
};

module.exports = SeguimientoPsicosocialModel;