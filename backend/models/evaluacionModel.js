const { sql, poolPromise } = require("../config/db");

class EvaluacionModel {
  static async obtenerTodas() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Evaluaciones_Vocacionales");
    return result.recordset;
  }
  static async obtenerPorEspecialidad() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      curso AS especialidad,
      tipo_evaluacion,
      COUNT(*) AS total
    FROM Evaluaciones_Vocacionales
    GROUP BY curso, tipo_evaluacion
    ORDER BY curso, tipo_evaluacion
  `);

  return result.recordset;
}

  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Evaluaciones_Vocacionales WHERE id = @id");
    return result.recordset[0];
  }

  static async obtenerPorEstudiante(idEstudiante) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, idEstudiante)
      .query("SELECT * FROM Evaluaciones_Vocacionales WHERE id_estudiante = @id_estudiante ORDER BY fecha_evaluacion DESC");
    return result.recordset;
  }
  


  static async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("tipo_evaluacion", sql.NVarChar, data.tipo_evaluacion)
      .input("resultados", sql.Text, data.resultados)
      .input("fecha_evaluacion", sql.DateTime, data.fecha_evaluacion)
      .input("nombre_completo", sql.NVarChar, data.nombre_completo)
      .input("curso", sql.NVarChar, data.curso)
      .query(`
        INSERT INTO Evaluaciones_Vocacionales 
        (id_estudiante, tipo_evaluacion, resultados, fecha_evaluacion, nombre_completo, curso)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @tipo_evaluacion, @resultados, @fecha_evaluacion, @nombre_completo, @curso)
      `);
    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("tipo_evaluacion", sql.NVarChar, data.tipo_evaluacion)
      .input("resultados", sql.Text, data.resultados)
      .input("fecha_evaluacion", sql.DateTime, data.fecha_evaluacion)
      .input("nombre_completo", sql.NVarChar, data.nombre_completo)
      .input("curso", sql.NVarChar, data.curso)
      .query(`
        UPDATE Evaluaciones_Vocacionales
        SET id_estudiante = @id_estudiante,
            tipo_evaluacion = @tipo_evaluacion,
            resultados = @resultados,
            fecha_evaluacion = @fecha_evaluacion,
            nombre_completo = @nombre_completo,
            curso = @curso
        WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Evaluaciones_Vocacionales WHERE id = @id");
  }
}

module.exports = EvaluacionModel;
