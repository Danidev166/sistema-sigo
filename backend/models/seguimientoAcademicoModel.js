// backend/models/seguimientoAcademicoModel.js
const { sql, getPool } = require('../config/db');

// "YYYY-MM-DD" -> Date (evita desfases de zona horaria)
function toSqlDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(input);
}

const SeguimientoAcademicoModel = {
  async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante',  sql.Int,   data.id_estudiante)
      .input('asignatura',     sql.NVarChar, data.asignatura)
      .input('nota',                        data.nota)            // numérico
      .input('promedio_curso',              data.promedio_curso)  // numérico
      .input('fecha',          toSqlDate(data.fecha))
      .query(`
        INSERT INTO seguimiento_academico
          (id_estudiante, asignatura, nota, promedio_curso, fecha)
        VALUES
          (@id_estudiante, @asignatura, @nota, @promedio_curso, @fecha)
        RETURNING *
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT *
      FROM seguimiento_academico
      ORDER BY fecha DESC, id DESC
    `);
    return result.recordset;
  },

  async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await getPool();
    const req = pool.request().input('id_estudiante', sql.Int, id_estudiante);
    const filtroAnio = anio ? ' AND EXTRACT(YEAR FROM fecha) = @anio' : '';
    if (anio) req.input('anio', sql.Int, anio);

    const result = await req.query(`
      SELECT *
      FROM seguimiento_academico
      WHERE id_estudiante = @id_estudiante
      ${filtroAnio}
      ORDER BY fecha DESC, id DESC
    `);
    return result.recordset;
  },

  async obtenerNotasPorEstudiante(id_estudiante, anio) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante', sql.Int, id_estudiante)
      .input('anio',          sql.Int, anio)
      .query(`
        SELECT nota
        FROM seguimiento_academico
        WHERE id_estudiante = @id_estudiante
          AND EXTRACT(YEAR FROM fecha) = @anio
        ORDER BY fecha DESC, id DESC
      `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM seguimiento_academico WHERE id = @id');
    return result.recordset[0] || null;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',             sql.Int,     id)
      .input('id_estudiante',  sql.Int,     data.id_estudiante)
      .input('asignatura',     sql.NVarChar,data.asignatura)
      .input('nota',                        data.nota)
      .input('promedio_curso',              data.promedio_curso)
      .input('fecha',          toSqlDate(data.fecha))
      .query(`
        UPDATE seguimiento_academico
           SET id_estudiante  = @id_estudiante,
               asignatura     = @asignatura,
               nota           = @nota,
               promedio_curso = @promedio_curso,
               fecha          = @fecha
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM seguimiento_academico WHERE id = @id');
  }
};

module.exports = SeguimientoAcademicoModel;
