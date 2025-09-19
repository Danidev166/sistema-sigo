const { sql, poolPromise } = require("../config/db");

const AsistenciaModel = {
  async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar(50), data.tipo)
      .input("justificacion", sql.NVarChar(255), data.justificacion || "")
      .query(`
        INSERT INTO Asistencia (id_estudiante, fecha, tipo, justificacion)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @fecha, @tipo, @justificacion)
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Asistencia");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Asistencia WHERE id = @id");
    return result.recordset[0];
  },

  async obtenerPorEstudiante(id_estudiante, anio) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("anio", sql.Int, anio)
      .query(`
        SELECT tipo
        FROM Asistencia
        WHERE id_estudiante = @id_estudiante AND YEAR(fecha) = @anio
      `);
    return result.recordset;
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("tipo", sql.NVarChar(50), data.tipo)
      .input("justificacion", sql.NVarChar(255), data.justificacion || "")
      .query(`
        UPDATE Asistencia
        SET 
          id_estudiante = @id_estudiante,
          fecha = @fecha,
          tipo = @tipo,
          justificacion = @justificacion
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Asistencia WHERE id = @id");
  },

  // 🚀 NUEVO — asistenciaMensual para gráfico PRO
 async asistenciaMensual() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      MONTH(fecha) AS mes,
      SUM(CASE WHEN tipo = 'Presente' THEN 1 ELSE 0 END) AS presentes,
      SUM(CASE WHEN tipo IN ('Ausente', 'Justificada') THEN 1 ELSE 0 END) AS ausentes
    FROM Asistencia
    WHERE YEAR(fecha) = YEAR(GETDATE())
    GROUP BY MONTH(fecha)
    ORDER BY mes;
  `);

  return result.recordset;
}


};

module.exports = AsistenciaModel;
