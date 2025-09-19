const { sql, poolPromise } = require("../config/db");
const logger = require("../utils/logger");

const ConfiguracionModel = {
  async listar() {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query('SELECT * FROM Configuracion ORDER BY tipo, clave');
      return result.recordset;
    } catch (error) {
      logger.error('Error en listar configuraciones:', error);
      throw error;
    }
  },

  async obtenerPorTipo(tipo) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('tipo', sql.VarChar(50), tipo)
        .query('SELECT * FROM Configuracion WHERE tipo = @tipo');
      
      // Transformar los resultados en un objeto más manejable
      const configuraciones = {};
      result.recordset.forEach(item => {
        configuraciones[item.clave] = item.valor;
      });
      
      return configuraciones;
    } catch (error) {
      logger.error(`Error en obtenerPorTipo (${tipo}):`, error);
      throw error;
    }
  },

  async crear(data) {
    try {
      const { tipo, clave, valor, descripcion, usuario_modificacion } = data;
      const pool = await poolPromise;
      await pool.request()
        .input('tipo', sql.VarChar(50), tipo)
        .input('clave', sql.VarChar(100), clave)
        .input('valor', sql.NVarChar(sql.MAX), valor)
        .input('descripcion', sql.NVarChar(255), descripcion)
        .input('usuario_modificacion', sql.VarChar(100), usuario_modificacion)
        .query(`
          INSERT INTO Configuracion (tipo, clave, valor, descripcion, usuario_modificacion)
          VALUES (@tipo, @clave, @valor, @descripcion, @usuario_modificacion)
        `);
    } catch (error) {
      logger.error('Error en crear configuración:', error);
      throw error;
    }
  },

  async actualizar(tipo, data) {
    try {
      const pool = await poolPromise;
      const { valores } = data;
      
      // Actualizar cada configuración del tipo especificado
      for (const [clave, valor] of Object.entries(valores)) {
        await pool.request()
          .input('tipo', sql.VarChar(50), tipo)
          .input('clave', sql.VarChar(100), clave)
          .input('valor', sql.NVarChar(sql.MAX), valor)
          .query(`
            UPDATE Configuracion
            SET valor = @valor,
                fecha_modificacion = GETDATE()
            WHERE tipo = @tipo AND clave = @clave
          `);
      }
    } catch (error) {
      logger.error(`Error en actualizar configuración (${tipo}):`, error);
      throw error;
    }
  },

  async eliminar(id) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Configuracion WHERE id = @id');
    } catch (error) {
      logger.error(`Error en eliminar configuración (ID: ${id}):`, error);
      throw error;
    }
  },

  async obtenerPorId(id) {
    const result = await sql.query`SELECT * FROM Configuracion WHERE id = ${id}`;
    return result.recordset[0];
  }
};

module.exports = ConfiguracionModel;
