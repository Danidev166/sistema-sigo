// backend/models/seguimientoAcademicoModel.js
const { getPool } = require('../config/db');

const SeguimientoAcademicoModel = {
  async crear(data) {
    const pool = await getPool();
    const query = `
      INSERT INTO seguimiento_academico
        (id_estudiante, rendimiento, asistencia_porcentaje, observaciones, recomendaciones, responsable_id, periodo, fecha_seguimiento, asignatura, nota, promedio_curso, fecha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      data.asignatura || null,
      data.nota || null,
      data.promedio_curso || null,
      data.fecha || new Date()
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      ORDER BY sa.fecha_seguimiento DESC, sa.id DESC
    `;
    
    const result = await pool.raw.query(query);
    return result.rows;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const query = `
      SELECT sa.*, e.nombre, e.apellido, e.rut
      FROM seguimiento_academico sa
      LEFT JOIN estudiantes e ON sa.id_estudiante = e.id
      WHERE sa.id = $1
    `;
    
    const result = await pool.raw.query(query, [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await getPool();
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
    
    const result = await pool.raw.query(query, params);
    return result.rows;
  },

  async obtenerNotasPorEstudiante(id_estudiante, anio) {
    const pool = await getPool();
    const query = `
      SELECT asignatura, nota, promedio_curso, fecha, observaciones
      FROM seguimiento_academico
      WHERE id_estudiante = $1 AND EXTRACT(YEAR FROM fecha_seguimiento) = $2
      AND asignatura IS NOT NULL AND nota IS NOT NULL
      ORDER BY fecha DESC
    `;
    
    const result = await pool.raw.query(query, [id_estudiante, anio]);
    return result.rows;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const query = `
      UPDATE seguimiento_academico
      SET id_estudiante = $1,
          rendimiento = $2,
          asistencia_porcentaje = $3,
          observaciones = $4,
          recomendaciones = $5,
          responsable_id = $6,
          periodo = $7,
          fecha_seguimiento = $8,
          asignatura = $9,
          nota = $10,
          promedio_curso = $11,
          fecha = $12
      WHERE id = $13
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
      data.asignatura || null,
      data.nota || null,
      data.promedio_curso || null,
      data.fecha || new Date(),
      id
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    const pool = await getPool();
    const query = `DELETE FROM seguimiento_academico WHERE id = $1 RETURNING *`;
    const result = await pool.raw.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = SeguimientoAcademicoModel;