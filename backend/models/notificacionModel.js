// backend/models/notificacionModel.js
const { sql, getPool } = require('../config/db');

function toSqlDateTime(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const d = new Date(input);
  return isNaN(d) ? null : d;
}

const NotificacionModel = {
  async obtenerTodos() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT *
      FROM notificaciones
      ORDER BY fecha_creacion DESC, id DESC
    `);
    return result.recordset;
  },

  async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_usuario',      sql.Int,      data.id_usuario)
      .input('tipo',            sql.NVarChar, data.tipo)
      .input('titulo',          sql.NVarChar, data.titulo)
      .input('mensaje',         sql.NVarChar, data.mensaje || '')
      .input('prioridad',       sql.NVarChar, data.prioridad || 'Normal')
      .input('categoria',       sql.NVarChar, data.categoria || null)
      .input('id_estudiante',   sql.Int,      data.id_estudiante ?? null)
      .input('fecha_limite',    sql.DateTime, toSqlDateTime(data.fecha_limite))
      .input('leida',           sql.Bit,      !!data.leida)
      .input('accion_requerida',sql.NVarChar, data.accion_requerida || null)
      .query(`
        INSERT INTO notificaciones
          (id_usuario, tipo, titulo, mensaje, prioridad, categoria, id_estudiante, fecha_limite, leida, accion_requerida, fecha_creacion)
        VALUES
          (@id_usuario, @tipo, @titulo, @mensaje, @prioridad, @categoria, @id_estudiante, @fecha_limite, @leida, @accion_requerida, NOW())
        RETURNING id
      `);
    return { insertId: result.recordset[0].id };
  },

  async marcarComoLeida(id, leida) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('leida', sql.Bit, !!leida)
      .query(`
        UPDATE notificaciones
           SET leida = @leida
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM notificaciones WHERE id = @id`);
  },
};

module.exports = NotificacionModel;
