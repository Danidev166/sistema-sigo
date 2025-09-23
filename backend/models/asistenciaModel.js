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
    const result = await pool.request()
      .input('id_estudiante', sql.Int, data.id_estudiante)
      .input('fecha',         sql.Date, toPgDate(data.fecha))
      .input('tipo',          sql.NVarChar(50),  data.tipo)
      .input('justificacion', sql.NVarChar(255), data.justificacion || '')
      .query(`
        INSERT INTO asistencia (id_estudiante, fecha, tipo, justificacion)
        VALUES (@id_estudiante, @fecha, @tipo, @justificacion)
        RETURNING *
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT *
      FROM asistencia
      ORDER BY fecha DESC, id DESC
    `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM asistencia WHERE id = @id');
    return result.recordset[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante, anio) {
    const pool = await getPool();
    const req = pool.request().input('id_estudiante', sql.Int, id_estudiante);
    if (anio) req.input('anio', sql.Int, anio);

    const result = await req.query(`
      SELECT tipo, fecha, justificacion
      FROM asistencia
      WHERE id_estudiante = @id_estudiante
        ${anio ? 'AND EXTRACT(YEAR FROM fecha) = @anio' : ''}
      ORDER BY fecha DESC, id DESC
    `);

    return result.recordset;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',            sql.Int, id)
      .input('id_estudiante', sql.Int, data.id_estudiante)
      .input('fecha',         sql.Date, toPgDate(data.fecha))
      .input('tipo',          sql.NVarChar(50),  data.tipo)
      .input('justificacion', sql.NVarChar(255), data.justificacion || '')
      .query(`
        UPDATE asistencia
           SET id_estudiante = @id_estudiante,
               fecha         = @fecha,
               tipo          = @tipo,
               justificacion = @justificacion
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM asistencia WHERE id = @id');
  },

  // presentes vs ausentes por mes
  async asistenciaMensual(anio = new Date().getFullYear()) {
    const pool = await getPool();
    const result = await pool.request()
      .input('anio', sql.Int, anio)
      .query(`
        SELECT
          DATE_PART('month', fecha)::int AS mes,
          SUM(CASE WHEN tipo = 'Presente' THEN 1 ELSE 0 END) AS presentes,
          SUM(CASE WHEN tipo IN ('Ausente','Justificada') THEN 1 ELSE 0 END) AS ausentes
        FROM asistencia
        WHERE EXTRACT(YEAR FROM fecha) = @anio
        GROUP BY DATE_PART('month', fecha)
        ORDER BY mes
      `);
    return result.recordset;
  }
};

module.exports = AsistenciaModel;
