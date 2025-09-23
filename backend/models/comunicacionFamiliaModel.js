// backend/models/comunicacionFamiliaModel.js
const { sql, getPool } = require('../config/db');

function toPgDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return input;
  return new Date(input);
}

const ComunicacionFamiliaModel = {
  async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante',  sql.Int,             data.id_estudiante)
      .input('fecha',          sql.Date,            toPgDate(data.fecha))
      .input('tipo',           sql.NVarChar(50),    data.tipo)
      .input('detalle',        sql.NVarChar,        data.detalle || '')
      .input('responsable',    sql.NVarChar(100),   data.responsable)
      .input('proxima_accion', sql.NVarChar(255),   data.proxima_accion || null)
      .query(`
        INSERT INTO comunicacionfamilia (id_estudiante, fecha, tipo, detalle, responsable, proxima_accion)
        VALUES (@id_estudiante, @fecha, @tipo, @detalle, @responsable, @proxima_accion)
        RETURNING *
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT *
      FROM comunicacionfamilia
      ORDER BY fecha DESC, id DESC
    `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM comunicacionfamilia WHERE id = @id');
    return result.recordset[0] || null;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',             sql.Int,            id)
      .input('id_estudiante',  sql.Int,            data.id_estudiante)
      .input('fecha',          sql.Date,           toPgDate(data.fecha))
      .input('tipo',           sql.NVarChar(50),   data.tipo)
      .input('detalle',        sql.NVarChar,       data.detalle || '')
      .input('responsable',    sql.NVarChar(100),  data.responsable)
      .input('proxima_accion', sql.NVarChar(255),  data.proxima_accion || null)
      .query(`
        UPDATE comunicacionfamilia
           SET id_estudiante = @id_estudiante,
               fecha          = @fecha,
               tipo           = @tipo,
               detalle        = @detalle,
               responsable    = @responsable,
               proxima_accion = @proxima_accion
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM comunicacionfamilia WHERE id = @id');
  }
};

module.exports = ComunicacionFamiliaModel;
