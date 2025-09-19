const { sql, poolPromise } = require("../config/db");

const SeguimientoPsicosocialModel = {
  async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("motivo", sql.NVarChar(255), data.motivo)
      .input("objetivos", sql.Text, data.objetivos)
      .input("plan_intervencion", sql.Text, data.plan_intervencion || "")
      .input("profesional_asignado", sql.NVarChar(255), data.profesional_asignado)
      .input("estado", sql.NVarChar(50), data.estado)
      .input("observaciones", sql.Text, data.observaciones || "")
      .query(`
        INSERT INTO Seguimiento_Psicosocial
        (id_estudiante, fecha, motivo, objetivos, plan_intervencion, profesional_asignado, estado, observaciones)
        OUTPUT INSERTED.*
        VALUES
        (@id_estudiante, @fecha, @motivo, @objetivos, @plan_intervencion, @profesional_asignado, @estado, @observaciones)
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.*, e.nombre, e.apellido
      FROM Seguimiento_Psicosocial s
      INNER JOIN Estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha DESC
    `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM Seguimiento_Psicosocial WHERE id = @id`);
    return result.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("fecha", sql.Date, data.fecha)
      .input("motivo", sql.NVarChar(255), data.motivo)
      .input("objetivos", sql.Text, data.objetivos)
      .input("plan_intervencion", sql.Text, data.plan_intervencion || "")
      .input("profesional_asignado", sql.NVarChar(255), data.profesional_asignado)
      .input("estado", sql.NVarChar(50), data.estado)
      .input("observaciones", sql.Text, data.observaciones || "")
      .query(`
        UPDATE Seguimiento_Psicosocial
        SET
          fecha = @fecha,
          motivo = @motivo,
          objetivos = @objetivos,
          plan_intervencion = @plan_intervencion,
          profesional_asignado = @profesional_asignado,
          estado = @estado,
          observaciones = @observaciones
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Seguimiento_Psicosocial WHERE id = @id`);
  }
};

module.exports = SeguimientoPsicosocialModel;
