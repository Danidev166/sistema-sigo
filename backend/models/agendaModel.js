const { sql, poolPromise } = require("../config/db");

class AgendaModel {
  // backend/models/agendaModel.js
static async obtenerTodos() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      a.id,
      a.id_estudiante,
      e.nombre + ' ' + e.apellido AS nombre_estudiante,
      CONVERT(varchar(5), a.hora, 108) AS hora,
      FORMAT(a.fecha, 'yyyy-MM-dd') AS fecha,
      a.motivo,
      a.profesional,
      a.creado_en,
      a.email_orientador
    FROM Agenda a
    LEFT JOIN Estudiantes e ON e.id = a.id_estudiante
    ORDER BY a.fecha DESC
  `);
  return result.recordset;
}





  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Agenda WHERE id = @id");
    return result.recordset[0];
  }

  static async crear(data) {
    const pool = await poolPromise;

    // Convertir "HH:mm" a objeto Date si es necesario
    const hora = typeof data.hora === "string"
      ? new Date(`1970-01-01T${data.hora}:00Z`)
      : data.hora;

    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("hora", sql.Time, hora)
      .input("motivo", sql.NVarChar(255), data.motivo)
      .input("profesional", sql.NVarChar(100), data.profesional)
      .input("email_orientador", sql.NVarChar(255), data.email_orientador || null)
      .input("creado_en", sql.DateTime, new Date())
      .query(`
        INSERT INTO Agenda (id_estudiante, fecha, hora, motivo, profesional, email_orientador, creado_en)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @fecha, @hora, @motivo, @profesional, @email_orientador, @creado_en)
      `);

    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;

    const hora = typeof data.hora === "string"
      ? new Date(`1970-01-01T${data.hora}:00Z`)
      : data.hora;

    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.Date, data.fecha)
      .input("hora", sql.Time, hora)
      .input("motivo", sql.NVarChar(255), data.motivo)
      .input("profesional", sql.NVarChar(100), data.profesional)
      .input("email_orientador", sql.NVarChar(255), data.email_orientador || null)
      .query(`
        UPDATE Agenda
        SET id_estudiante = @id_estudiante,
            fecha = @fecha,
            hora = @hora,
            motivo = @motivo,
            profesional = @profesional,
            email_orientador = @email_orientador
        WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id)
      .query("DELETE FROM Agenda WHERE id = @id");
  }
}

module.exports = AgendaModel;
