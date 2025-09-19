// models/recursoModel.js
const { sql, poolPromise } = require("../config/db");

class RecursoModel {
  static async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id, nombre, descripcion, tipo_recurso, estado, fecha_creacion
      FROM Recursos
      ORDER BY nombre
    `);
    return result.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT id, nombre, descripcion, tipo_recurso, estado, fecha_creacion
        FROM Recursos
        WHERE id = @id
      `);
    return result.recordset[0];
  }

  static async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("nombre", sql.NVarChar(150), data.nombre)
      .input("descripcion", sql.Text, data.descripcion)
      .input("tipo_recurso", sql.NVarChar(50), data.tipo_recurso)
      .query(`
        INSERT INTO Recursos (nombre, descripcion, tipo_recurso)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @tipo_recurso)
      `);
    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(150), data.nombre)
      .input("descripcion", sql.Text, data.descripcion)
      .input("tipo_recurso", sql.NVarChar(50), data.tipo_recurso)
      .query(`
        UPDATE Recursos
        SET nombre = @nombre,
            descripcion = @descripcion,
            tipo_recurso = @tipo_recurso
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Recursos WHERE id = @id");
  }
}

module.exports = RecursoModel;
