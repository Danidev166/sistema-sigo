// backend/models/usuarioModel.js
const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(renderConfig);

// Helpers
const normEmail = (e) => (typeof e === 'string' ? e.trim().toLowerCase() : e);
const normRut   = (r) => (typeof r === 'string' ? r.trim() : r);

const obtenerUsuarios = async () => {
  const result = await pool.query(`
    SELECT id, nombre, apellido, rut, email, rol, estado
    FROM usuarios
    ORDER BY id DESC
  `);
  return result.rows;
};

const obtenerUsuariosPaginado = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  
  // Construir condición de búsqueda
  let whereClause = '';
  let searchParams = [];
  let paramIndex = 1;
  
  if (search && search.trim()) {
    whereClause = `WHERE (
      nombre ILIKE $${paramIndex} OR 
      apellido ILIKE $${paramIndex} OR 
      email ILIKE $${paramIndex} OR 
      rol ILIKE $${paramIndex}
    )`;
    searchParams.push(`%${search.trim()}%`);
    paramIndex++;
  }
  
  // Obtener total de registros
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM usuarios 
    ${whereClause}
  `;
  
  const countResult = await pool.query(countQuery, searchParams);
  const total = parseInt(countResult.rows[0].total);
  
  // Obtener registros paginados
  const dataQuery = `
    SELECT id, nombre, apellido, rut, email, rol, estado
    FROM usuarios
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  const dataParams = [...searchParams, limit, offset];
  const dataResult = await pool.query(dataQuery, dataParams);
  
  return {
    data: dataResult.rows,
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
  const result = await pool.query(`
    SELECT id, nombre, apellido, rut, email, rol, estado
    FROM usuarios
    WHERE id = $1
  `, [id]);
  return result.rows[0] || null;
};

const crearUsuario = async (usuario) => {
  // Nota: se asume que usuario.password ya viene *hasheado*
  const result = await pool.query(`
    INSERT INTO usuarios (nombre, apellido, rut, email, password, rol, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [
    usuario.nombre,
    usuario.apellido,
    normRut(usuario.rut),
    normEmail(usuario.email),
    usuario.password,
    usuario.rol,
    usuario.estado || 'Activo'
  ]);
  return result.rows[0];
};

const actualizarUsuario = async (id, usuario) => {
  await pool.query(`
    UPDATE usuarios
       SET nombre   = $1,
           apellido = $2,
           rut      = $3,
           email    = $4,
           rol      = $5,
           estado   = $6
     WHERE id = $7
  `, [
    usuario.nombre,
    usuario.apellido,
    normRut(usuario.rut),
    normEmail(usuario.email),
    usuario.rol,
    usuario.estado || 'Activo',
    id
  ]);
};

const actualizarEstadoUsuario = async (id, activoBoolean) => {
  // Mapea booleano → 'Activo'/'Inactivo' (según DDL propuesto)
  const nuevoEstado = activoBoolean ? 'Activo' : 'Inactivo';
  await pool.query(`
    UPDATE usuarios
       SET estado = $1
     WHERE id = $2
  `, [nuevoEstado, id]);
};

const eliminarUsuario = async (id) => {
  await pool.query(`
    DELETE FROM usuarios WHERE id = $1
  `, [id]);
};

const obtenerUsuarioPorEmail = async (email) => {
  const result = await pool.query(`
    SELECT id, nombre, apellido, email, password, rol, estado, reset_token, reset_token_expiration
    FROM usuarios
    WHERE LOWER(email) = $1
    LIMIT 1
  `, [normEmail(email)]);
  return result.rows[0] || null;
};

const actualizarTokenReset = async (id, token, expiration) => {
  await pool.query(`
    UPDATE usuarios
       SET reset_token = $1,
           reset_token_expiration = $2
     WHERE id = $3
  `, [token, expiration, id]);
};

const limpiarTokenReset = async (id) => {
  await pool.query(`
    UPDATE usuarios
       SET reset_token = NULL,
           reset_token_expiration = NULL
     WHERE id = $1
  `, [id]);
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
  limpiarTokenReset
};