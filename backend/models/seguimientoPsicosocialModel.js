// backend/models/seguimientoPsicosocialModel.js
const { sql, getPool } = require('../config/db');

// "YYYY-MM-DD" -> Date (evita desfases por zona horaria)
function toSqlDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(input);
}

const SeguimientoPsicosocialModel = {
  async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante',        sql.Int,          data.id_estudiante)
      .input('fecha',                sql.Date,         toSqlDate(data.fecha))
      .input('motivo',               sql.NVarChar(255),data.motivo)
      .input('objetivos',            sql.NVarChar,     data.objetivos || '')
      .input('plan_intervencion',    sql.NVarChar,     data.plan_intervencion || '')
      .input('profesional_asignado', sql.NVarChar(255),data.profesional_asignado)
      .input('estado',               sql.NVarChar(50), data.estado || 'Pendiente')
      .input('observaciones',        sql.NVarChar,     data.observaciones || '')
      .query(`
        INSERT INTO seguimiento_psicosocial
          (id_estudiante, fecha, motivo, objetivos, plan_intervencion,
           profesional_asignado, estado, observaciones)
        VALUES
          (@id_estudiante, @fecha, @motivo, @objetivos, @plan_intervencion,
           @profesional_asignado, @estado, @observaciones)
        RETURNING *
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT s.*, e.nombre, e.apellido
      FROM seguimiento_psicosocial s
      INNER JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha DESC, s.id DESC
    `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM seguimiento_psicosocial WHERE id = @id`);
    return result.recordset[0] || null;
  },

  async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',                   sql.Int,           id)
      .input('fecha',                sql.Date,          toSqlDate(data.fecha))
      .input('motivo',               sql.NVarChar(255), data.motivo)
      .input('objetivos',            sql.NVarChar,      data.objetivos || '')
      .input('plan_intervencion',    sql.NVarChar,      data.plan_intervencion || '')
      .input('profesional_asignado', sql.NVarChar(255), data.profesional_asignado)
      .input('estado',               sql.NVarChar(50),  data.estado || 'Pendiente')
      .input('observaciones',        sql.NVarChar,      data.observaciones || '')
      .query(`
        UPDATE seguimiento_psicosocial
           SET fecha                = @fecha,
               motivo               = @motivo,
               objetivos            = @objetivos,
               plan_intervencion    = @plan_intervencion,
               profesional_asignado = @profesional_asignado,
               estado               = @estado,
               observaciones        = @observaciones
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM seguimiento_psicosocial WHERE id = @id`);
  }
};

module.exports = SeguimientoPsicosocialModel;
