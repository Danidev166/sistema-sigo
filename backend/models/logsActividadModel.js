const { poolPromise, sql } = require('../config/db');

class LogsActividadModel {
  async obtenerTodos(filtros = {}) {
    const pool = await poolPromise;
    let query = `
      SELECT l.*, u.nombre + ' ' + u.apellido AS usuario_nombre
      FROM Logs_Actividad l
      LEFT JOIN usuarios u ON l.id_usuario = u.id
      WHERE 1=1
    `;
    const params = {};
    // Filtro por usuario (nombre o id)
    if (filtros.usuario) {
      if (!isNaN(Number(filtros.usuario))) {
        query += ' AND l.id_usuario = @usuarioId';
        params.usuarioId = Number(filtros.usuario);
      } else {
        query += " AND (u.nombre + ' ' + u.apellido LIKE @usuarioNombre)";
        params.usuarioNombre = `%${filtros.usuario}%`;
      }
    }
    // Filtro por acción
    if (filtros.accion) {
      query += ' AND l.accion LIKE @accion';
      params.accion = `%${filtros.accion}%`;
    }
    // Filtro por tabla
    if (filtros.tabla) {
      query += ' AND l.tabla_afectada LIKE @tabla';
      params.tabla = `%${filtros.tabla}%`;
    }
    // Filtro por IP
    if (filtros.ip) {
      query += ' AND l.ip_address LIKE @ip';
      params.ip = `%${filtros.ip}%`;
    }
    // Filtro por fecha
    if (filtros.fecha_desde) {
      query += ' AND l.fecha_accion >= @fecha_desde';
      params.fecha_desde = filtros.fecha_desde;
    }
    if (filtros.fecha_hasta) {
      query += ' AND l.fecha_accion <= @fecha_hasta';
      params.fecha_hasta = filtros.fecha_hasta;
    }
    query += ' ORDER BY l.fecha_accion DESC';
    let req = pool.request();
    Object.entries(params).forEach(([key, value]) => {
      req = req.input(key, value);
    });
    const result = await req.query(query);
    return result.recordset;
  }
  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Logs_Actividad WHERE id = @id');
    return result.recordset[0];
  }
  async crear(data) {
    const { id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos, ip_address, user_agent } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('accion', sql.NVarChar(100), accion)
      .input('tabla_afectada', sql.NVarChar(100), tabla_afectada)
      .input('id_registro', sql.Int, id_registro)
      .input('datos_anteriores', sql.NVarChar(sql.MAX), datos_anteriores)
      .input('datos_nuevos', sql.NVarChar(sql.MAX), datos_nuevos)
      .input('ip_address', sql.NVarChar(45), ip_address)
      .input('user_agent', sql.NVarChar(500), user_agent)
      .query(`INSERT INTO Logs_Actividad 
        (id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos, ip_address, user_agent)
        VALUES (@id_usuario, @accion, @tabla_afectada, @id_registro, @datos_anteriores, @datos_nuevos, @ip_address, @user_agent);
        SELECT SCOPE_IDENTITY() AS id;`);
    return { insertId: result.recordset[0].id };
  }
  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Logs_Actividad WHERE id = @id');
    return;
  }
}

module.exports = new LogsActividadModel(); 