const { sql, poolPromise } = require("../config/db");

class MovimientoModel {
  static async registrar(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_recurso", sql.Int, data.id_recurso)
      .input("tipo_movimiento", sql.NVarChar(20), data.tipo_movimiento)
      .input("cantidad", sql.Int, data.cantidad)
      .input("observaciones", sql.Text, data.observaciones)
      .input("id_estudiante", sql.Int, data.id_estudiante || null)
      .input("responsable", sql.NVarChar(100), data.responsable || null)
      .query(`
        INSERT INTO Movimiento_Recursos (
          id_recurso, tipo_movimiento, cantidad, fecha,
          observaciones, id_estudiante, responsable
        )
        OUTPUT INSERTED.*
        VALUES (
          @id_recurso, @tipo_movimiento, @cantidad, GETDATE(),
          @observaciones, @id_estudiante, @responsable
        )
      `);
    return result.recordset[0];
  }

  static async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT m.*, r.nombre AS recurso, e.nombre + ' ' + e.apellido AS estudiante

      FROM Movimiento_Recursos m
      JOIN Recursos r ON m.id_recurso = r.id
      LEFT JOIN Estudiantes e ON m.id_estudiante = e.id
      ORDER BY m.fecha DESC
    `);
    return result.recordset;
  }
}

module.exports = MovimientoModel;
