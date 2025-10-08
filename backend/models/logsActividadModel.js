// backend/models/logsActividadModel.js
const { sql, getPool } = require('../config/db');

function toSqlDateTime(input, endOfDay = false) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const d = new Date(input);
  if (isNaN(d)) return null;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
}

class LogsActividadModel {
  async obtenerTodos(filtros = {}) {
    const pool = await getPool();

    let query = `
      SELECT l.*, (u.nombre || ' ' || u.apellido) AS usuario_nombre
      FROM logs_actividad l
      LEFT JOIN usuarios u ON l.id_usuario = u.id
      WHERE 1=1
    `;

    const req = pool.request();

    if (filtros.usuario !== undefined && filtros.usuario !== null && `${filtros.usuario}`.trim() !== '') {
      const asNumber = Number(filtros.usuario);
      if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) {
        query += ` AND l.id_usuario = @usuarioId`;
        req.input('usuarioId', sql.Int, asNumber);
      } else {
        query += ` AND (u.nombre || ' ' || u.apellido) LIKE @usuarioNombre`;
        req.input('usuarioNombre', sql.NVarChar, `%${String(filtros.usuario).trim()}%`);
      }
    }

    if (filtros.accion) {
      query += ` AND l.accion LIKE @accion`;
      req.input('accion', sql.NVarChar, `%${String(filtros.accion).trim()}%`);
    }

    if (filtros.tabla) {
      query += ` AND l.tabla_afectada LIKE @tabla`;
      req.input('tabla', sql.NVarChar, `%${String(filtros.tabla).trim()}%`);
    }

    if (filtros.ip) {
      query += ` AND l.ip_address LIKE @ip`;
      req.input('ip', sql.NVarChar, `%${String(filtros.ip).trim()}%`);
    }

    const desde = toSqlDateTime(filtros.fecha_desde, false);
    const hasta = toSqlDateTime(filtros.fecha_hasta, true);
    if (desde) {
      query += ` AND l.fecha_accion >= @fecha_desde`;
      req.input('fecha_desde', sql.DateTime, desde);
    }
    if (hasta) {
      query += ` AND l.fecha_accion <= @fecha_hasta`;
      req.input('fecha_hasta', sql.DateTime, hasta);
    }

    query += ` ORDER BY l.fecha_accion DESC, l.id DESC`;

    const result = await req.query(query);
    return result.recordset;
  }

  async obtenerTodosPaginado(filtros = {}, { page = 1, limit = 10 } = {}) {
    const pool = await getPool();
    const offset = (page - 1) * limit;

    // Construir query base
    let baseQuery = `
      FROM logs_actividad l
      LEFT JOIN usuarios u ON l.id_usuario = u.id
      WHERE 1=1
    `;

    const req = pool.request();

    // Aplicar filtros
    if (filtros.usuario !== undefined && filtros.usuario !== null && `${filtros.usuario}`.trim() !== '') {
      const asNumber = Number(filtros.usuario);
      if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) {
        baseQuery += ` AND l.id_usuario = @usuarioId`;
        req.input('usuarioId', sql.Int, asNumber);
      } else {
        baseQuery += ` AND (u.nombre || ' ' || u.apellido) LIKE @usuarioNombre`;
        req.input('usuarioNombre', sql.NVarChar, `%${String(filtros.usuario).trim()}%`);
      }
    }

    if (filtros.accion) {
      baseQuery += ` AND l.accion LIKE @accion`;
      req.input('accion', sql.NVarChar, `%${String(filtros.accion).trim()}%`);
    }

    if (filtros.tabla) {
      baseQuery += ` AND l.tabla_afectada LIKE @tabla`;
      req.input('tabla', sql.NVarChar, `%${String(filtros.tabla).trim()}%`);
    }

    if (filtros.ip) {
      baseQuery += ` AND l.ip_address LIKE @ip`;
      req.input('ip', sql.NVarChar, `%${String(filtros.ip).trim()}%`);
    }

    const desde = toSqlDateTime(filtros.fecha_desde, false);
    const hasta = toSqlDateTime(filtros.fecha_hasta, true);
    if (desde) {
      baseQuery += ` AND l.fecha_accion >= @fecha_desde`;
      req.input('fecha_desde', sql.DateTime, desde);
    }
    if (hasta) {
      baseQuery += ` AND l.fecha_accion <= @fecha_hasta`;
      req.input('fecha_hasta', sql.DateTime, hasta);
    }

    // Obtener total de registros
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const countResult = await req.query(countQuery);
    const total = parseInt(countResult.recordset[0].total);

    // Obtener registros paginados
    const dataQuery = `
      SELECT l.*, (u.nombre || ' ' || u.apellido) AS usuario_nombre
      ${baseQuery}
      ORDER BY l.fecha_accion DESC, l.id DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    req.input('offset', sql.Int, offset);
    req.input('limit', sql.Int, limit);

    const dataResult = await req.query(dataQuery);

    return {
      data: dataResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM logs_actividad WHERE id = @id`);
    return result.recordset[0] || null;
  }

  async crear(data) {
    const {
      id_usuario,
      accion,
      tabla_afectada,
      id_registro,
      datos_anteriores,
      datos_nuevos,
      ip_address,
      user_agent
    } = data;

    const pool = await getPool();
    const result = await pool.request()
      .input('id_usuario',       sql.Int,      id_usuario)
      .input('accion',           sql.NVarChar, accion)
      .input('tabla_afectada',   sql.NVarChar, tabla_afectada)
      .input('id_registro',      sql.Int,      id_registro ?? null)
      .input('datos_anteriores', sql.NVarChar, datos_anteriores ?? null)
      .input('datos_nuevos',     sql.NVarChar, datos_nuevos ?? null)
      .input('ip_address',       sql.NVarChar, ip_address ?? null)
      .input('user_agent',       sql.NVarChar, user_agent ?? null)
      .query(`
        INSERT INTO logs_actividad
          (id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos, ip_address, user_agent, fecha_accion)
        VALUES
          (@id_usuario, @accion, @tabla_afectada, @id_registro, @datos_anteriores, @datos_nuevos, @ip_address, @user_agent, NOW())
        RETURNING *
      `);

    return result.recordset[0];
  }

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM logs_actividad WHERE id = @id`);
  }
}

module.exports = new LogsActividadModel();
