// backend/models/configuracionModel.js
const { sql, getPool } = require('../config/db');
const logger = require('../utils/logger');

const ConfiguracionModel = {
  async listar() {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .query(`SELECT * FROM configuracion ORDER BY tipo, clave`);
      return result.recordset;
    } catch (error) {
      logger.error('Error en listar configuraciones:', error);
      throw error;
    }
  },

  async obtenerPorTipo(tipo) {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('tipo', sql.VarChar(50), tipo)
        .query(`SELECT * FROM configuracion WHERE tipo = @tipo`);

      const configuraciones = {};
      for (const row of result.recordset) configuraciones[row.clave] = row.valor;
      return configuraciones;
    } catch (error) {
      logger.error(`Error en obtenerPorTipo (${tipo}):`, error);
      throw error;
    }
  },

  async crear(data) {
    try {
      const { tipo, clave, valor, descripcion, usuario_modificacion } = data;
      const pool = await getPool();
      await pool.request()
        .input('tipo',                 sql.VarChar(50),   tipo)
        .input('clave',                sql.VarChar(100),  clave)
        .input('valor',                sql.NVarChar,      valor)
        .input('descripcion',          sql.NVarChar(255), descripcion || null)
        .input('usuario_modificacion', sql.VarChar(100),  usuario_modificacion || null)
        .query(`
          INSERT INTO configuracion (tipo, clave, valor, descripcion, usuario_modificacion, fecha_modificacion)
          VALUES (@tipo, @clave, @valor, @descripcion, @usuario_modificacion, NOW())
        `);
    } catch (error) {
      logger.error('Error en crear configuración:', error);
      throw error;
    }
  },

  // UPSERT por cada clave usando ON CONFLICT (requiere índice único (tipo, clave))
  async actualizar(tipo, data) {
    const pool = await getPool();
    const tx = pool.transaction();
    try {
      await tx.begin();

      const usuario = data.usuario_modificacion || null;
      const valores = data.valores || {};

      for (const [clave, valor] of Object.entries(valores)) {
        await tx.request()
          .input('tipo',  sql.VarChar(50),   tipo)
          .input('clave', sql.VarChar(100),  clave)
          .input('valor', sql.NVarChar,      valor)
          .input('usuario_modificacion', sql.VarChar(100), usuario)
          .query(`
            INSERT INTO configuracion (tipo, clave, valor, descripcion, usuario_modificacion, fecha_modificacion)
            VALUES (@tipo, @clave, @valor, NULL, @usuario_modificacion, NOW())
            ON CONFLICT (tipo, clave) DO UPDATE
              SET valor = EXCLUDED.valor,
                  usuario_modificacion = EXCLUDED.usuario_modificacion,
                  fecha_modificacion   = NOW()
          `);
      }

      await tx.commit();
    } catch (error) {
      try { await tx.rollback(); } catch (_) {}
      logger.error(`Error en actualizar configuración (${tipo}):`, error);
      throw error;
    }
  },

  async eliminar(id) {
    try {
      const pool = await getPool();
      await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM configuracion WHERE id = @id`);
    } catch (error) {
      logger.error(`Error en eliminar configuración (ID: ${id}):`, error);
      throw error;
    }
  },

  async obtenerPorId(id) {
    try {
      const pool = await getPool();
      const r = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM configuracion WHERE id = @id`);
      return r.recordset[0] || null;
    } catch (error) {
      logger.error(`Error en obtenerPorId (${id}):`, error);
      throw error;
    }
  }
};

module.exports = ConfiguracionModel;
