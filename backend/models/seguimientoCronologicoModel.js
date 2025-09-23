// backend/models/seguimientoCronologicoModel.js
const { sql, getPool } = require('../config/db');

// Convierte string/Date a DateTime (fin de día opcional)
function toSqlDateTime(input, endOfDay = false) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const d = new Date(input);
  if (isNaN(d)) return null;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
}

class SeguimientoCronologicoModel {
  static async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante',           sql.Int,    data.id_estudiante)
      .input('fecha',                   toSqlDateTime(data.fecha) || new Date())
      .input('tipo_accion',             sql.NVarChar, data.tipo_accion)
      .input('categoria',               sql.NVarChar, data.categoria)
      .input('descripcion',             sql.NVarChar, data.descripcion || '')
      .input('profesional_responsable', sql.NVarChar, data.profesional_responsable || null)
      .input('estado',                  sql.NVarChar, data.estado || 'Pendiente')
      .input('observaciones',           sql.NVarChar, data.observaciones || null)
      .input('archivos_adjuntos',       sql.NVarChar, data.archivos_adjuntos || null)
      .input('prioridad',               sql.NVarChar, data.prioridad || 'Normal')
      .query(`
        INSERT INTO seguimiento_cronologico
          (id_estudiante, fecha, tipo_accion, categoria, descripcion,
           profesional_responsable, estado, observaciones, archivos_adjuntos, prioridad)
        VALUES
          (@id_estudiante, @fecha, @tipo_accion, @categoria, @descripcion,
           @profesional_responsable, @estado, @observaciones, @archivos_adjuntos, @prioridad)
        RETURNING *
      `);
    return r.recordset[0];
  }

  static async obtenerPorEstudiante(idEstudiante, filtros = {}) {
    const pool = await getPool();
    let query = `
      SELECT sc.*, e.nombre, e.apellido, e.curso
      FROM seguimiento_cronologico sc
      INNER JOIN estudiantes e ON sc.id_estudiante = e.id
      WHERE sc.id_estudiante = @id_estudiante
    `;
    const req = pool.request().input('id_estudiante', sql.Int, idEstudiante);

    if (filtros.categoria) {
      query += ' AND sc.categoria = @categoria';
      req.input('categoria', sql.NVarChar, filtros.categoria);
    }
    if (filtros.fechaDesde) {
      const desde = toSqlDateTime(filtros.fechaDesde);
      if (desde) {
        query += ' AND sc.fecha >= @fechaDesde';
        req.input('fechaDesde', desde);
      }
    }
    if (filtros.fechaHasta) {
      const hasta = toSqlDateTime(filtros.fechaHasta, true);
      if (hasta) {
        query += ' AND sc.fecha <= @fechaHasta';
        req.input('fechaHasta', hasta);
      }
    }

    query += ' ORDER BY sc.fecha DESC, sc.id DESC';

    const r = await req.query(query);
    return r.recordset;
  }

  static async obtenerTodos(filtros = {}) {
    const pool = await getPool();
    let query = `
      SELECT sc.*, e.nombre, e.apellido, e.curso, e.rut
      FROM seguimiento_cronologico sc
      INNER JOIN estudiantes e ON sc.id_estudiante = e.id
      WHERE 1=1
    `;
    const req = pool.request();

    if (filtros.categoria) {
      query += ' AND sc.categoria = @categoria';
      req.input('categoria', sql.NVarChar, filtros.categoria);
    }
    if (filtros.profesional) {
      query += ' AND sc.profesional_responsable LIKE @profesional';
      req.input('profesional', sql.NVarChar, `%${String(filtros.profesional).trim()}%`);
    }
    if (filtros.estado) {
      query += ' AND sc.estado = @estado';
      req.input('estado', sql.NVarChar, filtros.estado);
    }
    if (filtros.fechaDesde) {
      const desde = toSqlDateTime(filtros.fechaDesde);
      if (desde) {
        query += ' AND sc.fecha >= @fechaDesde';
        req.input('fechaDesde', desde);
      }
    }
    if (filtros.fechaHasta) {
      const hasta = toSqlDateTime(filtros.fechaHasta, true);
      if (hasta) {
        query += ' AND sc.fecha <= @fechaHasta';
        req.input('fechaHasta', hasta);
      }
    }

    query += ' ORDER BY sc.fecha DESC, sc.id DESC';

    const r = await req.query(query);
    return r.recordset;
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id',                        sql.Int,    id)
      .input('fecha',                     toSqlDateTime(data.fecha) || new Date())
      .input('tipo_accion',               sql.NVarChar, data.tipo_accion)
      .input('categoria',                 sql.NVarChar, data.categoria)
      .input('descripcion',               sql.NVarChar, data.descripcion || '')
      .input('profesional_responsable',   sql.NVarChar, data.profesional_responsable || null)
      .input('estado',                    sql.NVarChar, data.estado)
      .input('observaciones',             sql.NVarChar, data.observaciones || null)
      .input('archivos_adjuntos',         sql.NVarChar, data.archivos_adjuntos || null)
      .input('prioridad',                 sql.NVarChar, data.prioridad || 'Normal')
      .query(`
        UPDATE seguimiento_cronologico
           SET fecha                   = @fecha,
               tipo_accion             = @tipo_accion,
               categoria               = @categoria,
               descripcion             = @descripcion,
               profesional_responsable = @profesional_responsable,
               estado                  = @estado,
               observaciones           = @observaciones,
               archivos_adjuntos       = @archivos_adjuntos,
               prioridad               = @prioridad
         WHERE id = @id
      `);
    return r.rowsAffected[0] > 0;
  }

  static async eliminar(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM seguimiento_cronologico WHERE id = @id`);
    return r.rowsAffected[0] > 0;
  }

  static async obtenerEstadisticas() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT 
        categoria,
        COUNT(*) FILTER (WHERE estado = 'Completado') AS completadas,
        COUNT(*) FILTER (WHERE estado = 'Pendiente')  AS pendientes,
        COUNT(*) AS total_acciones
      FROM seguimiento_cronologico
      GROUP BY categoria
      ORDER BY categoria
    `);
    return r.recordset;
  }
}

module.exports = SeguimientoCronologicoModel;
