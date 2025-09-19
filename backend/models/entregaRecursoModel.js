const { sql, poolPromise } = require("../config/db");

class EntregaRecursoModel {
 static async obtenerTodas() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      er.id,
      er.id_estudiante,
      e.nombre + ' ' + e.apellido AS nombre_estudiante,
      e.rut,
      e.curso,
      er.id_recurso,
      r.nombre AS recurso,
      er.cantidad_entregada AS cantidad,
      er.fecha_entrega,
      er.observaciones
    FROM Entrega_Recursos er
    LEFT JOIN Recursos r ON er.id_recurso = r.id
    LEFT JOIN Estudiantes e ON er.id_estudiante = e.id
    ORDER BY er.fecha_entrega DESC
  `);
  return result.recordset;
}



  static async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          er.id,
          er.id_estudiante,
          er.id_recurso,
          er.cantidad_entregada,
          er.fecha_entrega,
          er.observaciones,
          r.nombre AS nombre_recurso,
          r.tipo_recurso
        FROM Entrega_Recursos er
        LEFT JOIN Recursos r ON er.id_recurso = r.id
        WHERE er.id = @id
      `);
    return result.recordset[0];
  }

  static async obtenerPorEstudiante(idEstudiante) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("id_estudiante", sql.Int, idEstudiante)
    .query(`
     SELECT 
  er.id,
  er.id_estudiante,
  er.id_recurso,
  r.nombre AS nombre_recurso,
  r.tipo_recurso AS tipo,               -- ✅ alias correcto
  er.cantidad_entregada,               -- ✅ ya coincide con frontend
  er.fecha_entrega,
  er.observaciones
FROM Entrega_Recursos er
INNER JOIN Recursos r ON er.id_recurso = r.id
WHERE er.id_estudiante = @id_estudiante

    `);
  return result.recordset;
}

  static async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("id_recurso", sql.Int, data.id_recurso)
      .input("cantidad_entregada", sql.Int, data.cantidad_entregada)
      .input("fecha_entrega", sql.DateTime, data.fecha_entrega || new Date())
      .input("observaciones", sql.Text, data.observaciones || '')
      .query(`
        INSERT INTO Entrega_Recursos (
          id_estudiante,
          id_recurso,
          cantidad_entregada,
          fecha_entrega,
          observaciones
        )
        OUTPUT INSERTED.*
        VALUES (
          @id_estudiante,
          @id_recurso,
          @cantidad_entregada,
          @fecha_entrega,
          @observaciones
        )
      `);
    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("id_recurso", sql.Int, data.id_recurso)
      .input("cantidad_entregada", sql.Int, data.cantidad_entregada)
      .input("fecha_entrega", sql.DateTime, data.fecha_entrega)
      .input("observaciones", sql.Text, data.observaciones)
      .query(`
        UPDATE Entrega_Recursos
        SET 
          id_estudiante = @id_estudiante,
          id_recurso = @id_recurso,
          cantidad_entregada = @cantidad_entregada,
          fecha_entrega = @fecha_entrega,
          observaciones = @observaciones
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Entrega_Recursos WHERE id = @id");
  }
}

module.exports = EntregaRecursoModel;
