// backend/models/intervencionesModel.js
const { sql, getPool } = require('../config/db');

function toSqlDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(input);
}

const IntervencionModel = {
  async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante', sql.Int,      data.id_estudiante)
      .input('accion',        sql.NVarChar, data.accion || '')
      .input('responsable',   sql.NVarChar, data.responsable)
      .input('fecha',         sql.DateTime, toSqlDate(data.fecha))
      .input('meta',          sql.NVarChar, data.meta || null)
      .input('compromiso',    sql.NVarChar, data.compromiso || null)
      .input('completado',    sql.Bit,      !!data.completado)
      .input('id_profesional',sql.Int,      data.id_profesional)
      .query(`
        INSERT INTO intervenciones
          (id_estudiante, accion, responsable, fecha, meta, compromiso, completado, id_profesional)
        VALUES
          (@id_estudiante, @accion, @responsable, @fecha, @meta, @compromiso, @completado, @id_profesional)
        RETURNING *
      `);
    return r.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM intervenciones
      ORDER BY fecha DESC, id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM intervenciones WHERE id = @id`);
    return r.recordset[0] || null;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id',            sql.Int,      id)
      .input('id_estudiante', sql.Int,      data.id_estudiante)
      .input('accion',        sql.NVarChar, data.accion || '')
      .input('responsable',   sql.NVarChar, data.responsable)
      .input('fecha',         sql.DateTime, toSqlDate(data.fecha))
      .input('meta',          sql.NVarChar, data.meta || null)
      .input('compromiso',    sql.NVarChar, data.compromiso || null)
      .input('completado',    sql.Bit,      !!data.completado)
      .input('id_profesional',sql.Int,      data.id_profesional)
      .query(`
        UPDATE intervenciones
           SET id_estudiante = @id_estudiante,
               accion        = @accion,
               responsable   = @responsable,
               fecha         = @fecha,
               meta          = @meta,
               compromiso    = @compromiso,
               completado    = @completado,
               id_profesional= @id_profesional
         WHERE id = @id
        RETURNING *
      `);
    return r.recordset[0] || null;
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM intervenciones WHERE id = @id`);
  }
};

module.exports = IntervencionModel;
