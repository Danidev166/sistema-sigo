// ✅ models/usuarioModel.js
const { sql, poolPromise } = require("../config/db");

const obtenerUsuarios = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query("SELECT id, nombre, apellido, rut, email, rol, estado FROM Usuarios");
  return result.recordset;
};

const obtenerUsuarioPorId = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("SELECT id, nombre, apellido, rut, email, rol, estado FROM Usuarios WHERE id = @id");
  return result.recordset[0];
};

const crearUsuario = async (usuario) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("nombre", sql.NVarChar, usuario.nombre)
    .input("apellido", sql.NVarChar, usuario.apellido)
    .input("rut", sql.NVarChar, usuario.rut)
    .input("email", sql.NVarChar, usuario.email)
    .input("password", sql.NVarChar, usuario.password)
    .input("rol", sql.NVarChar, usuario.rol)
    .input("fecha_creacion", sql.DateTime, new Date())
    .query(`INSERT INTO Usuarios (nombre, apellido, rut, email, password, rol, fecha_creacion)
            OUTPUT INSERTED.*
            VALUES (@nombre, @apellido, @rut, @email, @password, @rol, @fecha_creacion)`);
  return result.recordset[0];
};

const actualizarUsuario = async (id, usuario) => {
  const pool = await poolPromise;
  await pool.request()
    .input("id", sql.Int, id)
    .input("nombre", sql.NVarChar, usuario.nombre)
    .input("apellido", sql.NVarChar, usuario.apellido)
    .input("rut", sql.NVarChar, usuario.rut)
    .input("email", sql.NVarChar, usuario.email)
    .input("rol", sql.NVarChar, usuario.rol)
    .query("UPDATE Usuarios SET nombre = @nombre, apellido = @apellido, rut = @rut, email = @email, rol = @rol WHERE id = @id");
};
const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  const pool = await poolPromise;
  await pool.request()
    .input("id", sql.Int, id)
    .input("estado", sql.Bit, nuevoEstado)
    .query("UPDATE Usuarios SET estado = @estado WHERE id = @id");
};


const eliminarUsuario = async (id) => {
  const pool = await poolPromise;
  await pool.request().input("id", sql.Int, id).query("DELETE FROM Usuarios WHERE id = @id");
};

const contar = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT COUNT(*) as total FROM Usuarios
  `);
  return result.recordset[0].total;
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  actualizarEstadoUsuario, // ✅ EXPORTADO
  eliminarUsuario,
  contar
};
