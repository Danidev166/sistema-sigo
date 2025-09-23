// backend/models/entregaRecursoModel.js
const { sql, getPool } = require('../config/db');

function toPgDateTime(input) {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  return new Date(input);
}

class EntregaRecursoModel {
  static async obtenerTodas() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        er.id,
        er.id_estudiante,
        (e.nombre || ' ' || e.apellido) AS nombre_estudiante,
        e.rut,
        e.curso,
        er.id_recurso,
        r.nombre AS recurso,
        er.cantidad_entregada AS cantidad,
        er.fecha_entrega,
        er.observaciones
      FROM entrega_recursos er
      LEFT JOIN recursos    r ON er.id_recurso    = r.id
      LEFT JOIN estudiantes e ON er.id_estudiante = e.id
      ORDER BY er.fecha_entrega DESC, er.id DESC
    `);
    return result.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          er.id,
          er.id_estudiante,
          er.id_recurso,
          er.cantidad_entregada,
          er.fecha_entrega,
          er.observaciones,
          r.nombre       AS nombre_recurso,
          r.tipo_recurso
        FROM entrega_recursos er
        LEFT JOIN recursos r ON er.id_recurso = r.id
        WHERE er.id = @id
      `);
    return result.recordset[0] || null;
  }

  static async obtenerPorEstudiante(id_estudiante) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante', sql.Int, id_estudiante)
      .query(`
        SELECT 
          er.id,
          er.id_estudiante,
          er.id_recurso,
          r.nombre        AS nombre_recurso,
          r.tipo_recurso  AS tipo,
          er.cantidad_entregada,
          er.fecha_entrega,
          er.observaciones
        FROM entrega_recursos er
        INNER JOIN recursos r ON er.id_recurso = r.id
        WHERE er.id_estudiante = @id_estudiante
        ORDER BY er.fecha_entrega DESC, er.id DESC
      `);
    return result.recordset;
  }

  static async crear(data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudiante',      sql.Int,        data.id_estudiante)
      .input('id_recurso',         sql.Int,        data.id_recurso)
      .input('cantidad_entregada', sql.Int,        data.cantidad_entregada)
      .input('fecha_entrega',      sql.DateTime,   toPgDateTime(data.fecha_entrega))
      .input('observaciones',      sql.NVarChar,   data.observaciones || '')
      .query(`
        INSERT INTO entrega_recursos (
          id_estudiante, id_recurso, cantidad_entregada, fecha_entrega, observaciones
        )
        VALUES (
          @id_estudiante, @id_recurso, @cantidad_entregada, @fecha_entrega, @observaciones
        )
        RETURNING *
      `);
    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id',                 sql.Int,        id)
      .input('id_estudiante',      sql.Int,        data.id_estudiante)
      .input('id_recurso',         sql.Int,        data.id_recurso)
      .input('cantidad_entregada', sql.Int,        data.cantidad_entregada)
      .input('fecha_entrega',      sql.DateTime,   toPgDateTime(data.fecha_entrega))
      .input('observaciones',      sql.NVarChar,   data.observaciones || '')
      .query(`
        UPDATE entrega_recursos
           SET id_estudiante      = @id_estudiante,
               id_recurso         = @id_recurso,
               cantidad_entregada = @cantidad_entregada,
               fecha_entrega      = @fecha_entrega,
               observaciones      = @observaciones
         WHERE id = @id
        RETURNING *
      `);
    return result.recordset[0] || null;
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM entrega_recursos WHERE id = @id`);
  }
}

module.exports = EntregaRecursoModel;
