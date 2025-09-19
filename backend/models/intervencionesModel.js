const { sql, poolPromise } = require("../config/db");

const IntervencionModel = {
  async crear(data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("accion", sql.NVarChar(sql.MAX), data.accion)
      .input("responsable", sql.NVarChar(100), data.responsable)
      .input("fecha", sql.Date, data.fecha)
      .input("meta", sql.NVarChar(255), data.meta)
      .input("compromiso", sql.NVarChar(255), data.compromiso)
      .input("completado", sql.Bit, data.completado)
      .input("id_profesional", sql.Int, data.id_profesional)
      .query(`
        INSERT INTO Intervenciones (id_estudiante, accion, responsable, fecha, meta, compromiso, completado, id_profesional)
        VALUES (@id_estudiante, @accion, @responsable, @fecha, @meta, @compromiso, @completado, @id_profesional)
      `);
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Intervenciones");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request().input("id", sql.Int, id)
      .query("SELECT * FROM Intervenciones WHERE id = @id");
    return result.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("accion", sql.NVarChar(sql.MAX), data.accion)
      .input("responsable", sql.NVarChar(100), data.responsable)
      .input("fecha", sql.Date, data.fecha)
      .input("meta", sql.NVarChar(255), data.meta)
      .input("compromiso", sql.NVarChar(255), data.compromiso)
      .input("completado", sql.Bit, data.completado)
      .input("id_profesional", sql.Int, data.id_profesional)
      .query(`
        UPDATE Intervenciones
        SET id_estudiante = @id_estudiante,
            accion = @accion,
            responsable = @responsable,
            fecha = @fecha,
            meta = @meta,
            compromiso = @compromiso,
            completado = @completado,
            id_profesional = @id_profesional
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id)
      .query("DELETE FROM Intervenciones WHERE id = @id");
  }
};

module.exports = IntervencionModel;
