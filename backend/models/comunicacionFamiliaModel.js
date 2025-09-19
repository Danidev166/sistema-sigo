const { poolPromise, sql } = require("../config/db");

const ComunicacionFamiliaModel = {
  async crear(data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar(50), data.tipo)
      .input("detalle", sql.Text, data.detalle)
      .input("responsable", sql.NVarChar(100), data.responsable)
      .input("proxima_accion", sql.NVarChar(255), data.proxima_accion)
      .query(`
        INSERT INTO ComunicacionFamilia (id_estudiante, fecha, tipo, detalle, responsable, proxima_accion)
        VALUES (@id_estudiante, @fecha, @tipo, @detalle, @responsable, @proxima_accion)
      `);
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM ComunicacionFamilia");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM ComunicacionFamilia WHERE id = @id");
    return result.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar(50), data.tipo)
      .input("detalle", sql.Text, data.detalle)
      .input("responsable", sql.NVarChar(100), data.responsable)
      .input("proxima_accion", sql.NVarChar(255), data.proxima_accion)
      .query(`
        UPDATE ComunicacionFamilia
        SET id_estudiante = @id_estudiante, fecha = @fecha, tipo = @tipo,
            detalle = @detalle, responsable = @responsable, proxima_accion = @proxima_accion
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id).query("DELETE FROM ComunicacionFamilia WHERE id = @id");
  }
};

module.exports = ComunicacionFamiliaModel;
