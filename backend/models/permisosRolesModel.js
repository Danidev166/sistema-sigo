// backend/models/permisosRolesModel.js
const { sql, getPool } = require('../config/db');

const PermisosRolesModel = {
  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM permisos_roles
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM permisos_roles WHERE id = @id`);
    return r.recordset[0] || null;
  },

  async crear(data) {
    const pool = await getPool();
    const { rol, modulo, accion, permitido } = data;

    const r = await pool.request()
      .input('rol',       sql.NVarChar, rol)
      .input('modulo',    sql.NVarChar, modulo)
      .input('accion',    sql.NVarChar, accion)
      .input('permitido', sql.Bit,      !!permitido)
      .query(`
        INSERT INTO permisos_roles (rol, modulo, accion, permitido)
        VALUES (@rol, @modulo, @accion, @permitido)
        RETURNING *
      `);

    return r.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const { rol, modulo, accion, permitido } = data;

    const r = await pool.request()
      .input('id',        sql.Int,      id)
      .input('rol',       sql.NVarChar, rol)
      .input('modulo',    sql.NVarChar, modulo)
      .input('accion',    sql.NVarChar, accion)
      .input('permitido', sql.Bit,      !!permitido)
      .query(`
        UPDATE permisos_roles
           SET rol = @rol,
               modulo = @modulo,
               accion = @accion,
               permitido = @permitido
         WHERE id = @id
        RETURNING *
      `);

    return r.recordset[0] || null;
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM permisos_roles WHERE id = @id`);
  }
};

module.exports = PermisosRolesModel;
