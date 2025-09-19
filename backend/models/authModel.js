const { sql, poolPromise } = require("../config/db");

// Buscar usuario por email
const buscarPorEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query("SELECT id, nombre, apellido, email, password, rol, estado FROM Usuarios WHERE email = @email");
  return result.recordset[0];
};

// Actualizar reset token y expiración
const guardarResetToken = async (email, token, expiracion) => {
  const pool = await poolPromise;
  await pool.request()
    .input("email", sql.NVarChar, email)
    .input("reset_token", sql.NVarChar, token)
    .input("reset_token_expiration", sql.DateTime, expiracion)
    .query(`
      UPDATE Usuarios
      SET reset_token = @reset_token, reset_token_expiration = @reset_token_expiration
      WHERE email = @email
    `);
};

// Buscar usuario por reset token válido
const buscarPorResetToken = async (token) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("reset_token", sql.NVarChar, token)
    .query(`
      SELECT * FROM Usuarios
      WHERE reset_token = @reset_token AND reset_token_expiration > GETDATE()
    `);
  return result.recordset[0];
};

// Actualizar contraseña por token
const actualizarPassword = async (id, hashedPassword) => {
  const pool = await poolPromise;
  await pool.request()
    .input("id", sql.Int, id)
    .input("password", sql.NVarChar, hashedPassword)
    .query(`
      UPDATE Usuarios
      SET password = @password, reset_token = NULL, reset_token_expiration = NULL
      WHERE id = @id
    `);
};

module.exports = {
  buscarPorEmail,
  guardarResetToken,
  buscarPorResetToken,
  actualizarPassword,
};
