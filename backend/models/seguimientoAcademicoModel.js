const { poolPromise, sql } = require("../config/db");

const SeguimientoAcademicoModel = {
  async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("asignatura", sql.NVarChar(100), data.asignatura)
      .input("nota", sql.Float, data.nota)
      .input("promedio_curso", sql.Float, data.promedio_curso)
      .input("fecha", sql.Date, data.fecha)
      .query(`
        INSERT INTO SeguimientoAcademico 
        (id_estudiante, asignatura, nota, promedio_curso, fecha)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @asignatura, @nota, @promedio_curso, @fecha)
      `);
    return result.recordset[0];
  },

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM SeguimientoAcademico");
    return result.recordset;
  },

  async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await poolPromise;
    let query = `
      SELECT * FROM SeguimientoAcademico 
      WHERE id_estudiante = @id_estudiante
    `;
    if (anio) {
      query += " AND YEAR(fecha) = @anio";
    }

    const request = pool.request().input("id_estudiante", sql.Int, id_estudiante);
    if (anio) request.input("anio", sql.Int, anio);

    const result = await request.query(query);
    return result.recordset;
  },

  async obtenerNotasPorEstudiante(id_estudiante, anio) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("anio", sql.Int, anio)
      .query(`
        SELECT nota
        FROM SeguimientoAcademico
        WHERE id_estudiante = @id_estudiante AND YEAR(fecha) = @anio
      `);
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM SeguimientoAcademico WHERE id = @id");
    return result.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("asignatura", sql.NVarChar(100), data.asignatura)
      .input("nota", sql.Float, data.nota)
      .input("promedio_curso", sql.Float, data.promedio_curso)
      .input("fecha", sql.Date, data.fecha)
      .query(`
        UPDATE SeguimientoAcademico
        SET 
          id_estudiante = @id_estudiante,
          asignatura = @asignatura,
          nota = @nota,
          promedio_curso = @promedio_curso,
          fecha = @fecha
        WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM SeguimientoAcademico WHERE id = @id");
  }
};

module.exports = SeguimientoAcademicoModel;
