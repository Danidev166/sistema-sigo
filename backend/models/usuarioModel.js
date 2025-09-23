// backend/models/usuarioModel.js
const { sql, getPool } = require('../config/db');

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
  // Nota: se asume que usuario.password ya viene *hasheado*
  const pool = await getPool();
  const result = await pool.request()
    .input('nombre',   sql.NVarChar(100), usuario.nombre)
    .input('apellido', sql.NVarChar(100), usuario.apellido)
    .input('rut',      sql.NVarChar(20),  normRut(usuario.rut))
    .input('email',    sql.NVarChar(150), normEmail(usuario.email))
    .input('password', sql.NVarChar(255), usuario.password)
    .input('rol',      sql.NVarChar(50),  usuario.rol)
    .input('estado',   sql.NVarChar(20),  usuario.estado || 'Activo')
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
    .input('id',       sql.Int,           id)
    .input('nombre',   sql.NVarChar(100), usuario.nombre)
    .input('apellido', sql.NVarChar(100), usuario.apellido)
    .input('rut',      sql.NVarChar(20),  normRut(usuario.rut))
    .input('email',    sql.NVarChar(150), normEmail(usuario.email))
    .input('rol',      sql.NVarChar(50),  usuario.rol)
    .input('estado',   sql.NVarChar(20),  usuario.estado || 'Activo')
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
  // Mapea booleano → 'Activo'/'Inactivo' (según DDL propuesto)
  const nuevoEstado = activoBoolean ? 'Activo' : 'Inactivo';
  const pool = await getPool();
  await pool.request()
    .input('id',     sql.Int,        id)
    .input('estado', sql.NVarChar(20), nuevoEstado)
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

const contar = async () => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT COUNT(*)::int AS total FROM usuarios
  `);
  return result.recordset[0]?.total ?? 0;
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  actualizarEstadoUsuario,
  eliminarUsuario,
  contar,
};
