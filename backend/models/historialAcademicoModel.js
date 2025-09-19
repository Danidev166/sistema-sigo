const { sql, poolPromise } = require("../config/db");

class HistorialModel {
  static async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Historial_Academico");
    return result.recordset;
  }

  static async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await poolPromise;
    let query = "SELECT * FROM Historial_Academico WHERE id_estudiante = @id_estudiante";
    const request = pool.request().input("id_estudiante", sql.Int, id_estudiante);

    if (anio) {
      query += " AND YEAR(fecha_actualizacion) = @anio";
      request.input("anio", sql.Int, anio);
    }

    const result = await request.query(query);
    return result.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Historial_Academico WHERE id = @id");
    return result.recordset[0];
  }

  static async crear(data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion
    } = data;

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("promedio_general", sql.Decimal(4, 2), promedio_general)
      .input("asistencia", sql.Float, asistencia)
      .input("observaciones_academicas", sql.Text, observaciones_academicas)
      .input("fecha_actualizacion", sql.DateTime, fecha_actualizacion || new Date())
      .query(`
        INSERT INTO Historial_Academico 
        (id_estudiante, promedio_general, asistencia, observaciones_academicas, fecha_actualizacion)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @promedio_general, @asistencia, @observaciones_academicas, @fecha_actualizacion)
      `);

    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion
    } = data;

    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("promedio_general", sql.Decimal(4, 2), promedio_general)
      .input("asistencia", sql.Float, asistencia)
      .input("observaciones_academicas", sql.Text, observaciones_academicas)
      .input("fecha_actualizacion", sql.DateTime, fecha_actualizacion || new Date())
      .query(`
        UPDATE Historial_Academico
        SET 
          id_estudiante = @id_estudiante,
          promedio_general = @promedio_general,
          asistencia = @asistencia,
          observaciones_academicas = @observaciones_academicas,
          fecha_actualizacion = @fecha_actualizacion
        WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Historial_Academico WHERE id = @id");
  }
}

module.exports = HistorialModel;
