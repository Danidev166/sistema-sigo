const { sql, poolPromise } = require("../config/db");

class EntrevistaModel {
  static async obtenerTodas() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Entrevistas");
    return result.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Entrevistas WHERE id = @id");
    return result.recordset[0];
  }

  static async obtenerPorEstudiante(idEstudiante, estado = null) {
    const pool = await poolPromise;

    let query = `
      SELECT e.*, u.nombre + ' ' + u.apellido AS nombre_orientador
      FROM Entrevistas e
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      WHERE e.id_estudiante = @id_estudiante
    `;

    if (estado) {
      query += " AND e.estado = @estado";
    }

    query += " ORDER BY e.fecha_entrevista DESC";

    const request = pool.request()
      .input("id_estudiante", sql.Int, idEstudiante);

    if (estado) {
      request.input("estado", sql.NVarChar(50), estado);
    }

    const result = await request.query(query);
    return result.recordset;
  }

  static async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("id_orientador", sql.Int, data.id_orientador)
      .input("fecha_entrevista", sql.DateTime, data.fecha_entrevista)
      .input("motivo", sql.NVarChar(255), data.motivo || "")
      .input("observaciones", sql.Text, data.observaciones || "")
      .input("estado", sql.NVarChar(50), data.estado || "Pendiente")
      .query(`
        INSERT INTO Entrevistas
        (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, estado)
        OUTPUT INSERTED.*
        VALUES (@id_estudiante, @id_orientador, @fecha_entrevista, @motivo, @observaciones, @estado)
      `);
    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("id_orientador", sql.Int, data.id_orientador)
      .input("fecha_entrevista", sql.DateTime, data.fecha_entrevista)
      .input("motivo", sql.NVarChar(255), data.motivo || "")
      .input("observaciones", sql.Text, data.observaciones || "")
      .input("estado", sql.NVarChar(50), data.estado || "Pendiente")
      .query(`
        UPDATE Entrevistas
        SET id_estudiante = @id_estudiante,
            id_orientador = @id_orientador,
            fecha_entrevista = @fecha_entrevista,
            motivo = @motivo,
            observaciones = @observaciones,
            estado = @estado
        WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Entrevistas WHERE id = @id");
  }

  // ✅ Obtener agenda por ID (corregido con parseInt)
 static async obtenerAgendaPorId(idAgenda) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("id", sql.Int, parseInt(idAgenda, 10))
    .query("SELECT * FROM Agenda WHERE id = @id");

  console.log("🔍 QUERY RESULT obtenerAgendaPorId:", result.recordset);

  return result.recordset[0];
}
static async obtenerPorMes() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      DATENAME(MONTH, fecha_entrevista) AS mes_nombre,
      MONTH(fecha_entrevista) AS mes_numero,
      COUNT(*) AS total
    FROM Entrevistas
    GROUP BY DATENAME(MONTH, fecha_entrevista), MONTH(fecha_entrevista)
    ORDER BY mes_numero
  `);

  return result.recordset.map(row => ({
    mes: row.mes_nombre.substring(0, 3), // "Ene", "Feb", etc.
    total: row.total
  }));
}



  // ✅ Marcar agenda como realizada
  static async marcarAgendaComoRealizada(idAgenda) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, parseInt(idAgenda, 10)) // ✅ También forzar a Int por seguridad
      .query(`
        UPDATE Agenda
        SET motivo = motivo + ' (Registrada)'
        WHERE id = @id
      `);
  }
}

module.exports = EntrevistaModel;
