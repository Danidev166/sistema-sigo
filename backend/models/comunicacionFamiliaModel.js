// backend/models/comunicacionFamiliaModel.js
const { getPool } = require('../config/db');

const ComunicacionFamiliaModel = {
  async crear(data) {
    const pool = await getPool();
    const query = `
      INSERT INTO comunicacion_familia
        (id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, asunto, contenido, responsable_nombre, respuesta_familia, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_comunicacion || new Date(),
      data.tipo_comunicacion,
      data.medio || '',
      data.asunto || '',
      data.contenido || '',
      data.responsable_nombre || null,
      data.respuesta_familia || '',
      data.estado || 'Enviado'
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      ORDER BY cf.fecha_comunicacion DESC, cf.id DESC
    `;
    
    const result = await pool.raw.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      WHERE cf.id = $1
    `;
    
    const result = await pool.raw.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const pool = await getPool();
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut, e.email_apoderado, e.nombre_apoderado
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      WHERE cf.id_estudiante = $1
      ORDER BY cf.fecha_comunicacion DESC, cf.id DESC
    `;
    
    const result = await pool.raw.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const query = `
      UPDATE comunicacion_familia
      SET id_estudiante = $1,
          fecha_comunicacion = $2,
          tipo_comunicacion = $3,
          medio = $4,
          asunto = $5,
          contenido = $6,
          responsable_nombre = $7,
          respuesta_familia = $8,
          estado = $9
      WHERE id = $10
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_comunicacion || new Date(),
      data.tipo_comunicacion,
      data.medio || '',
      data.asunto || '',
      data.contenido || '',
      data.responsable_nombre || null,
      data.respuesta_familia || '',
      data.estado || 'Enviado',
      id
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const pool = await getPool();
    const query = `DELETE FROM comunicacion_familia WHERE id = $1 RETURNING *`;
    const result = await pool.raw.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = ComunicacionFamiliaModel;
