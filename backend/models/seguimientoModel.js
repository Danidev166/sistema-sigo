// backend/models/seguimientoModel.js
const { getPool } = require('../config/db');

const SeguimientoModel = {
  async crear(data) {
    const pool = await getPool();
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
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async listar() {
    const pool = await getPool();
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `;
    
    const result = await pool.raw.query(query);
    return result.rows;
  },

  async obtenerTodos() {
    return await this.listar();
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id = $1
    `;
    
    const result = await pool.raw.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const pool = await getPool();
    const query = `
      SELECT s.*, e.nombre, e.apellido, e.rut
      FROM seguimiento s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      WHERE s.id_estudiante = $1
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `;
    
    const result = await pool.raw.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const pool = await getPool();
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
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const pool = await getPool();
    const query = `DELETE FROM seguimiento WHERE id = $1 RETURNING *`;
    const result = await pool.raw.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = SeguimientoModel;
