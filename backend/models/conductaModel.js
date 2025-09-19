const { sql, poolPromise } = require("../config/db");

const ConductaModel = {
  async crear(data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("observacion", sql.NVarChar(sql.MAX), data.observacion)
      .input("categoria", sql.NVarChar(50), data.categoria)
      .query(`
        INSERT INTO Conducta (id_estudiante, fecha, observacion, categoria)
        VALUES (@id_estudiante, @fecha, @observacion, @categoria)
      `);
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Conducta");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Conducta WHERE id = @id");
    return result.recordset[0];
  },

  async obtenerPorEstudiante(idEstudiante) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, idEstudiante)
      .query("SELECT * FROM Conducta WHERE id_estudiante = @id_estudiante ORDER BY fecha DESC");
    return result.recordset;
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("observacion", sql.NVarChar(sql.MAX), data.observacion)
      .input("categoria", sql.NVarChar(50), data.categoria)
      .query(`
        UPDATE Conducta
        SET id_estudiante = @id_estudiante,
            fecha = @fecha,
            observacion = @observacion,
            categoria = @categoria
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Conducta WHERE id = @id");
  }
};

module.exports = ConductaModel;
