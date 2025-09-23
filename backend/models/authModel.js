// backend/models/authModel.js
const { getPool } = require('../config/db');

const normEmail = (email) => (email || '').trim().toLowerCase();

async function buscarPorEmail(email) {
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
}

async function guardarResetToken(email, token, expiracion) {
  const pool = await getPool();
  await pool.request()
    .input('email', normEmail(email))
    .input('reset_token', token)
    .input('reset_token_expiration', expiracion)
    .query(`
      UPDATE usuarios
         SET reset_token = @reset_token,
             reset_token_expiration = @reset_token_expiration
       WHERE LOWER(email) = @email
    `);
}

async function buscarPorResetToken(token) {
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
}

async function actualizarPassword(id, hashedPassword) {
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
}

module.exports = {
  buscarPorEmail,
  guardarResetToken,
  buscarPorResetToken,
  actualizarPassword,
};
