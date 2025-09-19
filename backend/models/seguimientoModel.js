const { sql, poolPromise } = require("../config/db");

const SeguimientoModel = {
  async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar, data.tipo)
      .input("descripcion", sql.Text, data.descripcion)
      .input("profesional", sql.NVarChar, data.profesional)
      .input("subtipo", sql.NVarChar, data.subtipo)
      .input("archivo", sql.NVarChar, data.archivo)
      .input("urgencias", sql.NVarChar, data.urgencias)
      .query(`
        INSERT INTO Seguimiento (id_estudiante, fecha, tipo, descripcion, profesional, subtipo, archivo, urgencias)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @fecha, @tipo, @descripcion, @profesional, @subtipo, @archivo, @urgencias)
      `);
    return result.recordset[0];
  },

  async listar() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Seguimiento");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Seguimiento WHERE id = @id");
    return result.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar, data.tipo)
      .input("descripcion", sql.Text, data.descripcion)
      .input("profesional", sql.NVarChar, data.profesional)
      .input("subtipo", sql.NVarChar, data.subtipo)
      .input("archivo", sql.NVarChar, data.archivo)
      .input("urgencias", sql.NVarChar, data.urgencias)
      .query(`
        UPDATE Seguimiento
        SET fecha = @fecha, tipo = @tipo, descripcion = @descripcion,
            profesional = @profesional, subtipo = @subtipo,
            archivo = @archivo, urgencias = @urgencias
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id).query("DELETE FROM Seguimiento WHERE id = @id");
  }
};

module.exports = SeguimientoModel;
