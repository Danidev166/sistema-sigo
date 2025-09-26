// backend/models/asistenciaModel.js
const { sql, getPool } = require('../config/db');

function toPgDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return input; // 'YYYY-MM-DD'
  return new Date(input);
}

const AsistenciaModel = {
  async crear(data) {
    const pool = await getPool();
    const query = `
      INSERT INTO asistencia (id_estudiante, fecha, tipo, justificacion)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      data.id_estudiante,
      toPgDate(data.fecha),
      data.tipo,
      data.justificacion || ''
    ];
    const result = await pool.raw.query(query, values);
    return result.rows[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.raw.query(`
      SELECT *
      FROM asistencia
      ORDER BY fecha DESC, id DESC
    `);
    return result.rows;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.raw.query('SELECT * FROM asistencia WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante, anio) {
    const pool = await getPool();
    let query = `
      SELECT tipo, fecha, justificacion
      FROM asistencia
      WHERE id_estudiante = $1
    `;
    const values = [id_estudiante];
    
    if (anio) {
      query += ` AND EXTRACT(YEAR FROM fecha) = $2`;
      values.push(anio);
    }
    
    query += ` ORDER BY fecha DESC, id DESC`;

    const result = await pool.raw.query(query, values);
    return result.rows;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const query = `
      UPDATE asistencia
         SET id_estudiante = $1,
             fecha         = $2,
             tipo          = $3,
             justificacion = $4
       WHERE id = $5
    `;
    const values = [
      data.id_estudiante,
      toPgDate(data.fecha),
      data.tipo,
      data.justificacion || '',
      id
    ];
    await pool.raw.query(query, values);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.raw.query('DELETE FROM asistencia WHERE id = $1', [id]);
  },

  // presentes vs ausentes por mes
  async asistenciaMensual(anio = new Date().getFullYear()) {
    const pool = await getPool();
    const result = await pool.raw.query(`
      SELECT
        DATE_PART('month', fecha)::int AS mes,
        SUM(CASE WHEN tipo = 'Presente' THEN 1 ELSE 0 END) AS presentes,
        SUM(CASE WHEN tipo IN ('Ausente','Justificada') THEN 1 ELSE 0 END) AS ausentes
      FROM asistencia
      WHERE EXTRACT(YEAR FROM fecha) = $1
      GROUP BY DATE_PART('month', fecha)
      ORDER BY mes
    `, [anio]);
    return result.rows;
  }
};

module.exports = AsistenciaModel;
