const { sql, poolPromise } = require("../config/db");

class SeguimientoCronologicoModel {
  static async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_estudiante", sql.Int, data.id_estudiante)
      .input("fecha", sql.DateTime, data.fecha)
      .input("tipo_accion", sql.NVarChar(100), data.tipo_accion)
      .input("categoria", sql.NVarChar(50), data.categoria)
      .input("descripcion", sql.Text, data.descripcion)
      .input("profesional_responsable", sql.NVarChar(255), data.profesional_responsable)
      .input("estado", sql.NVarChar(50), data.estado)
      .input("observaciones", sql.Text, data.observaciones)
      .input("archivos_adjuntos", sql.NVarChar(sql.MAX), data.archivos_adjuntos)
      .input("prioridad", sql.NVarChar(20), data.prioridad)
      .query(`
        INSERT INTO Seguimiento_Cronologico 
        (id_estudiante, fecha, tipo_accion, categoria, descripcion, profesional_responsable, estado, observaciones, archivos_adjuntos, prioridad)
        OUTPUT INSERTED.*
        VALUES 
        (@id_estudiante, @fecha, @tipo_accion, @categoria, @descripcion, @profesional_responsable, @estado, @observaciones, @archivos_adjuntos, @prioridad)
      `);
    return result.recordset[0];
  }

  static async obtenerPorEstudiante(idEstudiante, filtros = {}) {
    const pool = await poolPromise;
    let query = `
      SELECT sc.*, e.nombre, e.apellido, e.curso
      FROM Seguimiento_Cronologico sc
      INNER JOIN Estudiantes e ON sc.id_estudiante = e.id
      WHERE sc.id_estudiante = @id_estudiante
    `;

    const request = pool.request().input("id_estudiante", sql.Int, idEstudiante);

    if (filtros.categoria) {
      query += " AND sc.categoria = @categoria";
      request.input("categoria", sql.NVarChar(50), filtros.categoria);
    }

    if (filtros.fechaDesde) {
      query += " AND sc.fecha >= @fechaDesde";
      request.input("fechaDesde", sql.DateTime, filtros.fechaDesde);
    }

    if (filtros.fechaHasta) {
      query += " AND sc.fecha <= @fechaHasta";
      request.input("fechaHasta", sql.DateTime, filtros.fechaHasta);
    }

    query += " ORDER BY sc.fecha DESC";

    const result = await request.query(query);
    return result.recordset;
  }

  static async obtenerTodos(filtros = {}) {
    const pool = await poolPromise;
    let query = `
      SELECT sc.*, e.nombre, e.apellido, e.curso, e.rut
      FROM Seguimiento_Cronologico sc
      INNER JOIN Estudiantes e ON sc.id_estudiante = e.id
      WHERE 1=1
    `;

    const request = pool.request();

    if (filtros.categoria) {
      query += " AND sc.categoria = @categoria";
      request.input("categoria", sql.NVarChar(50), filtros.categoria);
    }

    if (filtros.profesional) {
      query += " AND sc.profesional_responsable LIKE @profesional";
      request.input("profesional", sql.NVarChar(255), `%${filtros.profesional}%`);
    }

    if (filtros.estado) {
      query += " AND sc.estado = @estado";
      request.input("estado", sql.NVarChar(50), filtros.estado);
    }

    query += " ORDER BY sc.fecha DESC";

    const result = await request.query(query);
    return result.recordset;
  }

  static async actualizar(id, data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("fecha", sql.DateTime, data.fecha)
      .input("tipo_accion", sql.NVarChar(100), data.tipo_accion)
      .input("categoria", sql.NVarChar(50), data.categoria)
      .input("descripcion", sql.Text, data.descripcion)
      .input("profesional_responsable", sql.NVarChar(255), data.profesional_responsable)
      .input("estado", sql.NVarChar(50), data.estado)
      .input("observaciones", sql.Text, data.observaciones)
      .input("archivos_adjuntos", sql.NVarChar(sql.MAX), data.archivos_adjuntos)
      .input("prioridad", sql.NVarChar(20), data.prioridad)
      .query(`
        UPDATE Seguimiento_Cronologico
        SET fecha = @fecha,
            tipo_accion = @tipo_accion,
            categoria = @categoria,
            descripcion = @descripcion,
            profesional_responsable = @profesional_responsable,
            estado = @estado,
            observaciones = @observaciones,
            archivos_adjuntos = @archivos_adjuntos,
            prioridad = @prioridad
        WHERE id = @id
      `);
    return result.rowsAffected[0] > 0;
  }

  static async eliminar(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Seguimiento_Cronologico WHERE id = @id");
    return result.rowsAffected[0] > 0;
  }

  static async obtenerEstadisticas() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        categoria,
        COUNT(*) as total_acciones,
        COUNT(CASE WHEN estado = 'Completado' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as pendientes
      FROM Seguimiento_Cronologico
      GROUP BY categoria
    `);
    return result.recordset;
  }
}

module.exports = SeguimientoCronologicoModel; 