// backend/models/comunicacionFamiliaModel.js
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

const ComunicacionFamiliaModel = {
  async crear(data) {
    const query = `
      INSERT INTO comunicacion_familia
        (id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, asunto, contenido, responsable_id, respuesta_familia, estado)
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
      data.responsable_id || null,
      data.respuesta_familia || '',
      data.estado || 'Enviado'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      ORDER BY cf.fecha_comunicacion DESC, cf.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      WHERE cf.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut, e.email_apoderado, e.nombre_apoderado
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      WHERE cf.id_estudiante = $1
      ORDER BY cf.fecha_comunicacion DESC, cf.id DESC
    `;
    
    const result = await pool.query(query, [idEstudiante]);
    return result.rows;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT cf.*, e.nombre, e.apellido, e.rut, e.email_apoderado, e.nombre_apoderado
      FROM comunicacion_familia cf
      LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
      WHERE cf.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE comunicacion_familia
      SET id_estudiante = $1,
          fecha_comunicacion = $2,
          tipo_comunicacion = $3,
          medio = $4,
          asunto = $5,
          contenido = $6,
          responsable_id = $7,
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
      data.responsable_id || null,
      data.respuesta_familia || '',
      data.estado || 'Enviado',
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const query = `DELETE FROM comunicacion_familia WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = ComunicacionFamiliaModel;