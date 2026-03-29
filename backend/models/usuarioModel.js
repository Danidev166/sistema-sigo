// backend/models/usuarioModel.js
const { getPool, sql } = require('../config/db');

// Helpers
const normEmail = (e) => (typeof e === 'string' ? e.trim().toLowerCase() : e);
const normRut   = (r) => (typeof r === 'string' ? r.trim() : r);

const obtenerUsuarios = async () => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT id, nombre, apellido, rut, email, rol, estado
    FROM usuarios
    ORDER BY id DESC
  `);
  return result.recordset;
};

const obtenerUsuariosPaginado = async ({ page = 1, limit = 10, search = '' }) => {
  const pool = await getPool();
  const offset = (page - 1) * limit;
  
  // Construir condición de búsqueda
  let whereClause = '';
  const searchParam = search && search.trim() ? `%${search.trim()}%` : null;
  
  if (searchParam) {
    whereClause = `WHERE (
      nombre ILIKE @search OR
      apellido ILIKE @search OR
      email ILIKE @search OR
      rol ILIKE @search
    )`;
  }
  
  // Obtener total de registros
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM usuarios 
    ${whereClause}
  `;
  
  const countRequest = pool.request();
  if (searchParam) countRequest.input('search', sql.NVarChar, searchParam);
  const countResult = await countRequest.query(countQuery);
  const total = parseInt(countResult.recordset[0].total);
  
  // Obtener registros paginados
  const dataQuery = `
    SELECT id, nombre, apellido, rut, email, rol, estado
    FROM usuarios
    ${whereClause}
    ORDER BY id DESC
    LIMIT @limit OFFSET @offset
  `;
  
  const dataRequest = pool.request()
    .input('limit', sql.Int, limit)
    .input('offset', sql.Int, offset);
  if (searchParam) dataRequest.input('search', sql.NVarChar, searchParam);

  const dataResult = await dataRequest.query(dataQuery);
  
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
};

const obtenerUsuarioPorId = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT id, nombre, apellido, rut, email, rol, estado
      FROM usuarios
      WHERE id = @id
    `);
  return result.recordset[0] || null;
};

const crearUsuario = async (usuario) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('nombre',   sql.NVarChar, usuario.nombre)
    .input('apellido', sql.NVarChar, usuario.apellido)
    .input('rut',      sql.NVarChar, normRut(usuario.rut))
    .input('email',    sql.NVarChar, normEmail(usuario.email))
    .input('password', sql.NVarChar, usuario.password)
    .input('rol',      sql.NVarChar, usuario.rol)
    .input('estado',   sql.VarChar,  usuario.estado || 'Activo')
    .query(`
      INSERT INTO usuarios (nombre, apellido, rut, email, password, rol, estado)
      VALUES (@nombre, @apellido, @rut, @email, @password, @rol, @estado)
      RETURNING *
    `);
  return result.recordset[0];
};

const actualizarUsuario = async (id, usuario) => {
  const pool = await getPool();
  await pool.request()
    .input('nombre',   sql.NVarChar, usuario.nombre)
    .input('apellido', sql.NVarChar, usuario.apellido)
    .input('rut',      sql.NVarChar, normRut(usuario.rut))
    .input('email',    sql.NVarChar, normEmail(usuario.email))
    .input('rol',      sql.NVarChar, usuario.rol)
    .input('estado',   sql.VarChar,  usuario.estado || 'Activo')
    .input('id',       sql.Int,      id)
    .query(`
      UPDATE usuarios
         SET nombre   = @nombre,
             apellido = @apellido,
             rut      = @rut,
             email    = @email,
             rol      = @rol,
             estado   = @estado
       WHERE id = @id
    `);
};

const actualizarEstadoUsuario = async (id, activoBoolean) => {
  const pool = await getPool();
  const nuevoEstado = activoBoolean ? 'Activo' : 'Inactivo';
  await pool.request()
    .input('estado', sql.VarChar, nuevoEstado)
    .input('id',     sql.Int,     id)
    .query(`
      UPDATE usuarios
         SET estado = @estado
       WHERE id = @id
    `);
};

const eliminarUsuario = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM usuarios WHERE id = @id`);
};

const obtenerUsuarioPorEmail = async (email) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('email', normEmail(email))
    .query(`
      SELECT id, nombre, apellido, email, password, rol, estado, reset_token, reset_token_expiration
      FROM usuarios
      WHERE LOWER(email) = @email
      LIMIT 1
    `);
  return result.recordset[0] || null;
};

const actualizarTokenReset = async (id, token, expiration) => {
  const pool = await getPool();
  await pool.request()
    .input('token',      sql.NVarChar, token)
    .input('expiration', sql.DateTime, expiration)
    .input('id',         sql.Int,      id)
    .query(`
      UPDATE usuarios
         SET reset_token = @token,
             reset_token_expiration = @expiration
       WHERE id = @id
    `);
};

const limpiarTokenReset = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`
      UPDATE usuarios
         SET reset_token = NULL,
             reset_token_expiration = NULL
       WHERE id = @id
    `);
};

const buscarPorResetToken = async (token) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('reset_token', token)
    .query(`
      SELECT id, nombre, apellido, email, password, rol, estado
      FROM usuarios
      WHERE reset_token = @reset_token
        AND reset_token_expiration > NOW()
      LIMIT 1
    `);
  return result.recordset[0] || null;
};

const actualizarPassword = async (id, hashedPassword) => {
  const pool = await getPool();
  await pool.request()
    .input('id', id)
    .input('password', hashedPassword)
    .query(`
      UPDATE usuarios
         SET password = @password,
             reset_token = NULL,
             reset_token_expiration = NULL
       WHERE id = @id
    `);
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuariosPaginado,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  actualizarEstadoUsuario,
  eliminarUsuario,
  obtenerUsuarioPorEmail,
  actualizarTokenReset,
  limpiarTokenReset,
  buscarPorResetToken,
  actualizarPassword
};
