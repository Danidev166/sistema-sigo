// backend/models/conductaModel.js
const { sql, getPool } = require('../config/db');

function toPgDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return input;
  return new Date(input);
}

const ConductaModel = {
  async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante', sql.Int,            data.id_estudiante)
      .input('fecha',         sql.Date,           toPgDate(data.fecha))
      .input('observacion',   sql.NVarChar,       data.observacion || '')
      .input('categoria',     sql.NVarChar(50),   data.categoria)
      .query(`
        INSERT INTO conducta (id_estudiante, fecha, observacion, categoria)
        VALUES (@id_estudiante, @fecha, @observacion, @categoria)
        RETURNING *
      `);
    return r.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM conducta
      ORDER BY fecha DESC, id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM conducta WHERE id = @id');
    return r.recordset[0] || null;
  },

  async obtenerPorEstudiante(id_estudiante) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante', sql.Int, id_estudiante)
      .query(`
        SELECT *
        FROM conducta
        WHERE id_estudiante = @id_estudiante
        ORDER BY fecha DESC, id DESC
      `);
    return r.recordset;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',            sql.Int,           id)
      .input('id_estudiante', sql.Int,           data.id_estudiante)
      .input('fecha',         sql.Date,          toPgDate(data.fecha))
      .input('observacion',   sql.NVarChar,      data.observacion || '')
      .input('categoria',     sql.NVarChar(50),  data.categoria)
      .query(`
        UPDATE conducta
           SET id_estudiante = @id_estudiante,
               fecha         = @fecha,
               observacion   = @observacion,
               categoria     = @categoria
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM conducta WHERE id = @id');
  }
};

module.exports = ConductaModel;
