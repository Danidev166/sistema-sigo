// backend/models/configuracionSistemaModel.js
const { sql, getPool } = require('../config/db');

const ConfiguracionSistemaModel = {
  async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM configuracion_sistema
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM configuracion_sistema WHERE id = @id`);
    return r.recordset[0] || null;
  },

  async crear(data) {
    const pool = await getPool();
    const { clave, valor, tipo, descripcion, categoria, editable, modificado_por } = data;

    const r = await pool.request()
      .input('clave',          sql.VarChar(100),  clave)
      .input('valor',          sql.NVarChar,      valor)
      .input('tipo',           sql.VarChar(50),   tipo)
      .input('descripcion',    sql.NVarChar(255), descripcion || null)
      .input('categoria',      sql.VarChar(50),   categoria || null)
      .input('editable',       sql.Bit,           !!editable)
      .input('modificado_por', sql.VarChar(100),  modificado_por || null)
      .query(`
        INSERT INTO configuracion_sistema
          (clave, valor, tipo, descripcion, categoria, editable, modificado_por)
        VALUES
          (@clave, @valor, @tipo, @descripcion, @categoria, @editable, @modificado_por)
        RETURNING *
      `);

    return r.recordset[0];
  },

  async actualizar(id, data) {
    const pool = await getPool();
    const { valor, tipo, descripcion, categoria, editable, modificado_por } = data;

    const r = await pool.request()
      .input('id',             sql.Int,           id)
      .input('valor',          sql.NVarChar,      valor)
      .input('tipo',           sql.VarChar(50),   tipo)
      .input('descripcion',    sql.NVarChar(255), descripcion || null)
      .input('categoria',      sql.VarChar(50),   categoria || null)
      .input('editable',       sql.Bit,           !!editable)
      .input('modificado_por', sql.VarChar(100),  modificado_por || null)
      .query(`
        UPDATE configuracion_sistema
           SET valor             = @valor,
               tipo              = @tipo,
               descripcion       = @descripcion,
               categoria         = @categoria,
               editable          = @editable,
               modificado_por    = @modificado_por,
               fecha_modificacion= NOW()
         WHERE id = @id
        RETURNING *
      `);

    return r.recordset[0] || null;
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM configuracion_sistema WHERE id = @id`);
  }
};

module.exports = ConfiguracionSistemaModel;
