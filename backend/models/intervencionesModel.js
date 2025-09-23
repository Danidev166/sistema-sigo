// backend/models/intervencionesModel.js
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

const IntervencionModel = {
  async crear(data) {
    const query = `
      INSERT INTO intervenciones
        (id_estudiante, fecha_intervencion, tipo_intervencion, descripcion, objetivo, responsable_id, estado, resultado, fecha_finalizacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.fecha_intervencion || new Date(),
      data.tipo_intervencion,
      data.descripcion || '',
      data.objetivo || '',
      data.responsable_id || null,
      data.estado || 'Programada',
      data.resultado || '',
      data.fecha_finalizacion || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const query = `
      SELECT i.*, e.nombre, e.apellido, e.rut
      FROM intervenciones i
      LEFT JOIN estudiantes e ON i.id_estudiante = e.id
      ORDER BY i.fecha_intervencion DESC, i.id DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT i.*, e.nombre, e.apellido, e.rut
      FROM intervenciones i
      LEFT JOIN estudiantes e ON i.id_estudiante = e.id
      WHERE i.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(idEstudiante) {
    const query = `
      SELECT i.*, e.nombre, e.apellido, e.rut
      FROM intervenciones i
      LEFT JOIN estudiantes e ON i.id_estudiante = e.id
      WHERE i.id_estudiante = $1
      ORDER BY i.fecha_intervencion DESC, i.id DESC
    `;
    
    const result = await pool.query(query, [idEstudiante]);
    return result.rows;
  },

  async actualizar(id, data) {
    const query = `
      UPDATE intervenciones
      SET fecha_intervencion = $1,
          tipo_intervencion = $2,
          descripcion = $3,
          objetivo = $4,
          responsable_id = $5,
          estado = $6,
          resultado = $7,
          fecha_finalizacion = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      data.fecha_intervencion || new Date(),
      data.tipo_intervencion,
      data.descripcion || '',
      data.objetivo || '',
      data.responsable_id || null,
      data.estado || 'Programada',
      data.resultado || '',
      data.fecha_finalizacion || null,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const query = `DELETE FROM intervenciones WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_intervenciones,
        COUNT(CASE WHEN estado = 'Programada' THEN 1 END) as programadas,
        COUNT(CASE WHEN estado = 'En Proceso' THEN 1 END) as en_proceso,
        COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as completadas
      FROM intervenciones
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }
};

module.exports = IntervencionModel;