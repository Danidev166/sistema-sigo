// backend/models/recursoModel.js
const { sql, getPool } = require('../config/db');

class RecursoModel {
  static async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT id, nombre, descripcion, tipo_recurso, stock, activo, fecha_creacion
      FROM recursos
      WHERE activo = true
      ORDER BY nombre ASC, id ASC
    `);
    return r.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, nombre, descripcion, tipo_recurso, stock, activo, fecha_creacion
        FROM recursos
        WHERE id = @id
      `);
    return r.recordset[0] || null;
  }

  static async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('nombre', sql.NVarChar, data.nombre)
      .input('descripcion', sql.NVarChar, data.descripcion || null)
      .input('tipo_recurso', sql.NVarChar, data.tipo_recurso)
      .input('stock', sql.Int, data.stock || 0)
      .input('activo', sql.Bit, data.activo ?? true)
      .query(`
        INSERT INTO recursos (nombre, descripcion, tipo_recurso, stock, activo, fecha_creacion)
        VALUES (@nombre, @descripcion, @tipo_recurso, @stock, @activo, NOW())
        RETURNING *
      `);
    return r.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, data.nombre)
      .input('descripcion', sql.NVarChar, data.descripcion || null)
      .input('tipo_recurso', sql.NVarChar, data.tipo_recurso)
      .input('stock', sql.Int, data.stock || 0)
      .input('activo', sql.Bit, data.activo ?? true)
      .query(`
        UPDATE recursos
        SET nombre       = @nombre,
            descripcion  = @descripcion,
            tipo_recurso = @tipo_recurso,
            stock        = @stock,
            activo       = @activo
        WHERE id = @id
        RETURNING *
      `);
    return r.recordset[0] || null;
  }

  static async eliminar(id) {
    const pool = await getPool();
    // Eliminación lógica: marcar como inactivo en lugar de eliminar físicamente
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE recursos SET activo = false WHERE id = @id RETURNING *`);
    return r.recordset[0] || null;
  }
}

module.exports = RecursoModel;
