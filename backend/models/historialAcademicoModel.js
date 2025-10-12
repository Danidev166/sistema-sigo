// backend/models/historialAcademicoModel.js
const { getPool } = require('../config/db');

class HistorialModel {
  static async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.raw.query(`
      SELECT *
      FROM historial_academico
      ORDER BY fecha_actualizacion DESC, id DESC
    `);
    return result.rows;
  }

  static async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await getPool();
    let query = `
      SELECT *
      FROM historial_academico
      WHERE id_estudiante = $1
    `;
    const params = [id_estudiante];
    
    if (anio) {
      query += ` AND EXTRACT(YEAR FROM fecha_actualizacion) = $2`;
      params.push(anio);
    }
    
    query += ` ORDER BY fecha_actualizacion DESC, id DESC`;

    const result = await pool.raw.query(query, params);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.raw.query(`SELECT * FROM historial_academico WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  static async crear(data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion,
      año_academico,
      curso
    } = data;

    const pool = await getPool();
    const result = await pool.raw.query(`
      INSERT INTO historial_academico
        (id_estudiante, promedio_general, asistencia, observaciones_academicas, fecha_actualizacion, año_academico, curso)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas || '',
      fecha_actualizacion || new Date(),
      año_academico || new Date().getFullYear().toString(),
      curso || null
    ]);

    return result.rows[0];
  }

  static async actualizar(id, data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion,
      año_academico,
      curso
    } = data;

    const pool = await getPool();
    const result = await pool.raw.query(`
      UPDATE historial_academico
         SET id_estudiante            = $1,
             promedio_general         = $2,
             asistencia               = $3,
             observaciones_academicas = $4,
             fecha_actualizacion      = $5,
             año_academico            = $6,
             curso                    = $7
       WHERE id = $8
      RETURNING *
    `, [
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas || '',
      fecha_actualizacion || new Date(),
      año_academico || new Date().getFullYear().toString(),
      curso || null,
      id
    ]);
    
    return result.rows[0];
  }

  static async eliminar(id) {
    const pool = await getPool();
    const result = await pool.raw.query(`DELETE FROM historial_academico WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
}

module.exports = HistorialModel;
