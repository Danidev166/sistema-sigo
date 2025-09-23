// backend/models/comunicacionInternaModel.js
const { sql, getPool } = require('../config/db');

const ComunicacionInternaModel = {
  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM comunicacion_interna
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM comunicacion_interna WHERE id = @id`);
    return r.recordset[0] || null;
  },

  async crear(data) {
    const pool = await getPool();
    const { id_remitente, id_destinatario, asunto, mensaje, prioridad, leida, adjuntos } = data;

    const r = await pool.request()
      .input('id_remitente',    sql.Int,             id_remitente)
      .input('id_destinatario', sql.Int,             id_destinatario)
      .input('asunto',          sql.NVarChar(200),   asunto)
      .input('mensaje',         sql.NVarChar,        mensaje || '')
      .input('prioridad',       sql.NVarChar(20),    prioridad || 'Normal')
      .input('leida',           sql.Bit,             !!leida)      // booleano
      .input('adjuntos',        sql.NVarChar,        adjuntos || null)
      .query(`
        INSERT INTO comunicacion_interna
          (id_remitente, id_destinatario, asunto, mensaje, prioridad, leida, adjuntos)
        VALUES
          (@id_remitente, @id_destinatario, @asunto, @mensaje, @prioridad, @leida, @adjuntos)
        RETURNING *
      `);

    return r.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const { asunto, mensaje, prioridad, leida, adjuntos } = data;

    await pool.request()
      .input('id',        sql.Int,           id)
      .input('asunto',    sql.NVarChar(200), asunto)
      .input('mensaje',   sql.NVarChar,      mensaje || '')
      .input('prioridad', sql.NVarChar(20),  prioridad || 'Normal')
      .input('leida',     sql.Bit,           !!leida)
      .input('adjuntos',  sql.NVarChar,      adjuntos || null)
      .query(`
        UPDATE comunicacion_interna
           SET asunto        = @asunto,
               mensaje       = @mensaje,
               prioridad     = @prioridad,
               leida         = @leida,
               adjuntos      = @adjuntos,
               fecha_lectura = CASE WHEN @leida THEN COALESCE(fecha_lectura, NOW()) ELSE NULL END
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM comunicacion_interna WHERE id = @id`);
  },

  async marcarLeida(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE comunicacion_interna
           SET leida = TRUE,
               fecha_lectura = COALESCE(fecha_lectura, NOW())
         WHERE id = @id
      `);
  }
};

module.exports = ComunicacionInternaModel;
