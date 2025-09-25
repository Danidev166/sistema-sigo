// backend/models/entrevistaModel.js
const { sql, getPool } = require('../config/db');

// Fechas: acepta Date, ISO o "YYYY-MM-DD"
function toSqlDateTime(input) {
  if (input instanceof Date) return input;
  if (!input) return new Date();
  const d = new Date(input);
  return isNaN(d) ? new Date() : d;
}

class EntrevistaModel {
  static async obtenerTodas() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM entrevistas
      ORDER BY fecha_entrevista DESC, id DESC
    `);
    return r.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM entrevistas WHERE id = @id`);
    return r.recordset[0] || null;
  }

  static async obtenerPorEstudiante(idEstudiante, estado = null) {
    const pool = await getPool();
    const req = pool.request().input('id_estudiante', sql.Int, idEstudiante);
    const whereEstado = estado ? ' AND e.estado = @estado' : '';
    if (estado) req.input('estado', sql.NVarChar, estado);

    const r = await req.query(`
      SELECT e.*, (u.nombre || ' ' || u.apellido) AS nombre_orientador
      FROM entrevistas e
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      WHERE e.id_estudiante = @id_estudiante
      ${whereEstado}
      ORDER BY e.fecha_entrevista DESC, e.id DESC
    `);
    return r.recordset;
  }

  static async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante',    sql.Int,        data.id_estudiante)
      .input('id_orientador',    sql.Int,        data.id_orientador)
      .input('fecha_entrevista', sql.DateTime,   toSqlDateTime(data.fecha_entrevista))
      .input('motivo',           sql.NVarChar,   data.motivo || '')
      .input('observaciones',    sql.NVarChar,   data.observaciones || '')
      .input('estado',           sql.NVarChar,   data.estado || 'Pendiente')
      .query(`
        INSERT INTO entrevistas
          (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, estado)
        VALUES
          (@id_estudiante, @id_orientador, @fecha_entrevista, @motivo, @observaciones, @estado)
        RETURNING *
      `);
    return r.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',               sql.Int,        id)
      .input('id_estudiante',    sql.Int,        data.id_estudiante)
      .input('id_orientador',    sql.Int,        data.id_orientador)
      .input('fecha_entrevista', sql.DateTime,   toSqlDateTime(data.fecha_entrevista))
      .input('motivo',           sql.NVarChar,   data.motivo || '')
      .input('observaciones',    sql.NVarChar,   data.observaciones || '')
      .input('estado',           sql.NVarChar,   data.estado || 'Pendiente')
      .query(`
        UPDATE entrevistas
           SET id_estudiante    = @id_estudiante,
               id_orientador    = @id_orientador,
               fecha_entrevista = @fecha_entrevista,
               motivo           = @motivo,
               observaciones    = @observaciones,
               estado           = @estado
         WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM entrevistas WHERE id = @id`);
  }

  static async obtenerAgendaPorId(idAgenda) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, parseInt(idAgenda, 10))
      .query(`SELECT * FROM agenda WHERE id = @id`);
    return r.recordset[0] || null;
  }

  // 📊 Entrevistas por mes (del año actual)
  static async obtenerPorMes(anio = new Date().getFullYear()) {
    const pool = await getPool();
    const r = await pool.request()
      .input('anio', sql.Int, anio)
      .query(`
        SELECT 
          DATE_PART('month', fecha_entrevista)::int AS mes_numero,
          TO_CHAR(fecha_entrevista, 'Mon')         AS mes_nombre,
          COUNT(*)                                  AS total
        FROM entrevistas
        WHERE EXTRACT(YEAR FROM fecha_entrevista) = @anio
        GROUP BY mes_numero, mes_nombre
        ORDER BY mes_numero
      `);

    return r.recordset.map(row => ({
      mes: row.mes_nombre,
      total: row.total
    }));
  }

  static async marcarAgendaComoRealizada(idAgenda) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, parseInt(idAgenda, 10))
      .query(`
        UPDATE agenda
           SET motivo = motivo || ' (Registrada)'
         WHERE id = @id
      `);
  }

  // 📊 Estadísticas de entrevistas con filtros
  static async obtenerEstadisticas(filtros = {}) {
    const pool = await getPool();
    
    // Construir condiciones WHERE
    let whereConditions = [];
    let params = {};
    
    if (filtros.curso) {
      whereConditions.push('e.curso = @curso');
      params.curso = filtros.curso;
    }
    
    if (filtros.fecha_inicio) {
      whereConditions.push('e.fecha_entrevista >= @fecha_inicio');
      params.fecha_inicio = filtros.fecha_inicio;
    }
    
    if (filtros.fecha_fin) {
      whereConditions.push('e.fecha_entrevista <= @fecha_fin');
      params.fecha_fin = filtros.fecha_fin;
    }
    
    if (filtros.motivo) {
      whereConditions.push('e.motivo ILIKE @motivo');
      params.motivo = `%${filtros.motivo}%`;
    }
    
    if (filtros.profesional) {
      whereConditions.push('(u.nombre ILIKE @profesional OR u.apellido ILIKE @profesional)');
      params.profesional = `%${filtros.profesional}%`;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const request = pool.request();
    
    // Agregar parámetros
    Object.keys(params).forEach(key => {
      request.input(key, sql.NVarChar, params[key]);
    });
    
    const query = `
      SELECT 
        COUNT(*) as total_entrevistas,
        COUNT(CASE WHEN e.estado = 'realizada' THEN 1 END) as entrevistas_realizadas,
        COUNT(CASE WHEN e.estado = 'programada' THEN 1 END) as entrevistas_programadas,
        COUNT(CASE WHEN e.estado = 'cancelada' THEN 1 END) as entrevistas_canceladas,
        COUNT(DISTINCT e.id_estudiante) as estudiantes_atendidos,
        COUNT(DISTINCT e.id_orientador) as orientadores_activos,
        ROUND(AVG(CASE WHEN e.estado = 'realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) as porcentaje_realizacion
      FROM entrevistas e
      LEFT JOIN estudiantes est ON e.id_estudiante = est.id
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      ${whereClause}
    `;
    
    const r = await request.query(query);
    const stats = r.recordset[0];
    
    // Obtener estadísticas por motivo
    const motivoQuery = `
      SELECT 
        e.motivo,
        COUNT(*) as cantidad
      FROM entrevistas e
      LEFT JOIN estudiantes est ON e.id_estudiante = est.id
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      ${whereClause}
      GROUP BY e.motivo
      ORDER BY cantidad DESC
      LIMIT 10
    `;
    
    const motivoRequest = pool.request();
    Object.keys(params).forEach(key => {
      motivoRequest.input(key, sql.NVarChar, params[key]);
    });
    
    const motivoResult = await motivoRequest.query(motivoQuery);
    
    return {
      ...stats,
      motivos_mas_comunes: motivoResult.recordset,
      filtros_aplicados: filtros,
      fecha_consulta: new Date().toISOString()
    };
  }
}

module.exports = EntrevistaModel;
