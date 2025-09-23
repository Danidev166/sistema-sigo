// backend/models/seguimientoModel.js
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

const SeguimientoModel = {
  async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante', sql.Int,            data.id_estudiante)
      .input('fecha',         sql.Date,           toSqlDate(data.fecha))
      .input('tipo',          sql.NVarChar(50),   data.tipo)
      .input('descripcion',   sql.NVarChar,       data.descripcion || '')
      .input('profesional',   sql.NVarChar(100),  data.profesional || null)
      .input('subtipo',       sql.NVarChar(100),  data.subtipo || null)
      .input('archivo',       sql.NVarChar(500),  data.archivo || null)
      .input('urgencias',     sql.NVarChar(100),  data.urgencias || null)
      .query(`
        INSERT INTO seguimiento
          (id_estudiante, fecha, tipo, descripcion, profesional, subtipo, archivo, urgencias)
        VALUES
          (@id_estudiante, @fecha, @tipo, @descripcion, @profesional, @subtipo, @archivo, @urgencias)
        RETURNING *
      `);
    return result.recordset[0];
  },

  async listar() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT *
      FROM seguimiento
      ORDER BY fecha DESC, id DESC
    `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM seguimiento WHERE id = @id`);
    return result.recordset[0] || null;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',          sql.Int,           id)
      .input('fecha',       sql.Date,          toSqlDate(data.fecha))
      .input('tipo',        sql.NVarChar(50),  data.tipo)
      .input('descripcion', sql.NVarChar,      data.descripcion || '')
      .input('profesional', sql.NVarChar(100), data.profesional || null)
      .input('subtipo',     sql.NVarChar(100), data.subtipo || null)
      .input('archivo',     sql.NVarChar(500), data.archivo || null)
      .input('urgencias',   sql.NVarChar(100), data.urgencias || null)
      .query(`
        UPDATE seguimiento
           SET fecha       = @fecha,
               tipo        = @tipo,
               descripcion = @descripcion,
               profesional = @profesional,
               subtipo     = @subtipo,
               archivo     = @archivo,
               urgencias   = @urgencias
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM seguimiento WHERE id = @id`);
  }
};

module.exports = SeguimientoModel;
