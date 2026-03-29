// backend/models/conductaModel.js
const { getPool } = require('../config/db');

const ConductaModel = {
  async crear(data) {
    const pool = await getPool();
    const query = `
      INSERT INTO conducta
        (id_estudiante, fecha_incidente, tipo_conducta, descripcion, gravedad, medidas_tomadas, responsable_id, testigos, seguimiento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_incidente || new Date(),
      data.tipo_conducta,
      data.descripcion || '',
      data.gravedad || '',
      data.medidas_tomadas || '',
      data.responsable_id || null,
      data.testigos || '',
      data.seguimiento || ''
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const query = `
      SELECT c.*, e.nombre, e.apellido, e.rut
      FROM conducta c
      LEFT JOIN estudiantes e ON c.id_estudiante = e.id
      ORDER BY c.fecha_incidente DESC, c.id DESC
    `;
    
    const result = await pool.raw.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const query = `
      SELECT c.*, e.nombre, e.apellido, e.rut
      FROM conducta c
      LEFT JOIN estudiantes e ON c.id_estudiante = e.id
      WHERE c.id = $1
    `;
    
    const result = await pool.raw.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante) {
    const pool = await getPool();
    const query = `
      SELECT c.*, e.nombre, e.apellido, e.rut
      FROM conducta c
      LEFT JOIN estudiantes e ON c.id_estudiante = e.id
      WHERE c.id_estudiante = $1
      ORDER BY c.fecha_incidente DESC, c.id DESC
    `;
    
    const result = await pool.raw.query(query, [id_estudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const query = `
      UPDATE conducta
      SET id_estudiante = $1,
          fecha_incidente = $2,
          tipo_conducta = $3,
          descripcion = $4,
          gravedad = $5,
          medidas_tomadas = $6,
          responsable_id = $7,
          testigos = $8,
          seguimiento = $9
      WHERE id = $10
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_incidente || new Date(),
      data.tipo_conducta,
      data.descripcion || '',
      data.gravedad || '',
      data.medidas_tomadas || '',
      data.responsable_id || null,
      data.testigos || '',
      data.seguimiento || '',
      id
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const pool = await getPool();
    const query = `DELETE FROM conducta WHERE id = $1 RETURNING *`;
    const result = await pool.raw.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = ConductaModel;
