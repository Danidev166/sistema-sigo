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
    const result = await pool.raw.query(`
      SELECT 
        e.*,
        est.nombre AS nombre_estudiante,
        est.apellido AS apellido_estudiante,
        est.curso,
        (u.nombre || ' ' || u.apellido) AS profesional_nombre,
        u.nombre AS profesional_nombre_solo,
        u.apellido AS profesional_apellido
      FROM entrevistas e
      LEFT JOIN estudiantes est ON e.id_estudiante = est.id
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      ORDER BY e.fecha_entrevista DESC, e.id DESC
    `);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.raw.query('SELECT * FROM entrevistas WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async obtenerPorEstudiante(idEstudiante, estado = null) {
    const pool = await getPool();
    let query = `
      SELECT e.*, (u.nombre || ' ' || u.apellido) AS nombre_orientador
      FROM entrevistas e
      LEFT JOIN usuarios u ON e.id_orientador = u.id
      WHERE e.id_estudiante = $1
    `;
    const values = [idEstudiante];
    
    if (estado) {
      query += ' AND e.estado = $2';
      values.push(estado);
    }
    
    query += ' ORDER BY e.fecha_entrevista DESC, e.id DESC';
    
    const result = await pool.raw.query(query, values);
    return result.rows;
  }

  static async crear(data) {
    const pool = await getPool();
    const query = `
      INSERT INTO entrevistas
        (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, conclusiones, acciones_acordadas, estado)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante,
      data.id_orientador,
      toSqlDateTime(data.fecha_entrevista),
      data.motivo || '',
      data.observaciones || '',
      data.conclusiones || '',
      data.acciones_acordadas || '',
      data.estado || 'Pendiente'
    ];
    
    const result = await pool.raw.query(query, values);
    return result.rows[0];
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
    const result = await pool.raw.query('SELECT * FROM agenda WHERE id = $1', [parseInt(idAgenda, 10)]);
    return result.rows[0] || null;
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
    await pool.raw.query(`
      UPDATE agenda
         SET motivo = motivo || ' (Registrada)'
       WHERE id = $1
    `, [parseInt(idAgenda, 10)]);
  }

  // 📊 Estadísticas de entrevistas con filtros
  static async obtenerEstadisticas(filtros = {}) {
    try {
      const pool = await getPool();
      
      // Consulta simple primero para verificar que funciona
      const queryBasica = `
        SELECT 
          COUNT(*) as total_entrevistas,
          COUNT(CASE WHEN estado = 'realizada' THEN 1 END) as entrevistas_realizadas,
          COUNT(CASE WHEN estado = 'programada' THEN 1 END) as entrevistas_programadas,
          COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as entrevistas_canceladas,
          COUNT(DISTINCT id_estudiante) as estudiantes_atendidos,
          COUNT(DISTINCT id_orientador) as orientadores_activos
        FROM entrevistas
      `;
      
      const r = await pool.request().query(queryBasica);
      const stats = r.recordset[0];
      
      // Obtener estadísticas por motivo
      const motivoQuery = `
        SELECT 
          motivo,
          COUNT(*) as cantidad
        FROM entrevistas
        WHERE motivo IS NOT NULL AND motivo != ''
        GROUP BY motivo
        ORDER BY cantidad DESC
        LIMIT 10
      `;
      
      const motivoResult = await pool.request().query(motivoQuery);
      
      return {
        total_entrevistas: parseInt(stats.total_entrevistas) || 0,
        entrevistas_realizadas: parseInt(stats.entrevistas_realizadas) || 0,
        entrevistas_programadas: parseInt(stats.entrevistas_programadas) || 0,
        entrevistas_canceladas: parseInt(stats.entrevistas_canceladas) || 0,
        estudiantes_atendidos: parseInt(stats.estudiantes_atendidos) || 0,
        orientadores_activos: parseInt(stats.orientadores_activos) || 0,
        porcentaje_realizacion: stats.total_entrevistas > 0 ? 
          Math.round((stats.entrevistas_realizadas / stats.total_entrevistas) * 100) : 0,
        motivos_mas_comunes: motivoResult.recordset || [],
        filtros_aplicados: filtros,
        fecha_consulta: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error);
      // Retornar estadísticas por defecto en caso de error
      return {
        total_entrevistas: 0,
        entrevistas_realizadas: 0,
        entrevistas_programadas: 0,
        entrevistas_canceladas: 0,
        estudiantes_atendidos: 0,
        orientadores_activos: 0,
        porcentaje_realizacion: 0,
        motivos_mas_comunes: [],
        filtros_aplicados: filtros,
        fecha_consulta: new Date().toISOString(),
        error: error.message
      };
    }
  }
}

module.exports = EntrevistaModel;
