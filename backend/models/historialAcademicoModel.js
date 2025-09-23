// backend/models/historialAcademicoModel.js
const { sql, getPool } = require('../config/db');

function toSqlDateTime(input) {
  if (input instanceof Date) return input;
  if (!input) return new Date();
  const d = new Date(input);
  return isNaN(d) ? new Date() : d;
}

class HistorialModel {
  static async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM historial_academico
      ORDER BY fecha_actualizacion DESC, id DESC
    `);
    return r.recordset;
  }

  static async obtenerPorEstudiante(id_estudiante, anio = null) {
    const pool = await getPool();
    const req = pool.request().input('id_estudiante', sql.Int, id_estudiante);
    const filtroAnio = anio ? ' AND EXTRACT(YEAR FROM fecha_actualizacion) = @anio' : '';
    if (anio) req.input('anio', sql.Int, anio);

    const r = await req.query(`
      SELECT *
      FROM historial_academico
      WHERE id_estudiante = @id_estudiante
      ${filtroAnio}
      ORDER BY fecha_actualizacion DESC, id DESC
    `);
    return r.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM historial_academico WHERE id = @id`);
    return r.recordset[0] || null;
  }

  static async crear(data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion
    } = data;

    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante',           sql.Int,       id_estudiante)
      .input('promedio_general',        promedio_general) // sin tipo: el shim lo pasa como valor
      .input('asistencia',              asistencia)
      .input('observaciones_academicas',sql.NVarChar,  observaciones_academicas || '')
      .input('fecha_actualizacion',     sql.DateTime,  toSqlDateTime(fecha_actualizacion || new Date()))
      .query(`
        INSERT INTO historial_academico
          (id_estudiante, promedio_general, asistencia, observaciones_academicas, fecha_actualizacion)
        VALUES
          (@id_estudiante, @promedio_general, @asistencia, @observaciones_academicas, @fecha_actualizacion)
        RETURNING *
      `);

    return r.recordset[0];
  }

  static async actualizar(id, data) {
    const {
      id_estudiante,
      promedio_general,
      asistencia,
      observaciones_academicas,
      fecha_actualizacion
    } = data;

    const pool = await getPool();
    await pool.request()
      .input('id',                        sql.Int,      id)
      .input('id_estudiante',             sql.Int,      id_estudiante)
      .input('promedio_general',          promedio_general)
      .input('asistencia',                asistencia)
      .input('observaciones_academicas',  sql.NVarChar, observaciones_academicas || '')
      .input('fecha_actualizacion',       sql.DateTime, toSqlDateTime(fecha_actualizacion || new Date()))
      .query(`
        UPDATE historial_academico
           SET id_estudiante            = @id_estudiante,
               promedio_general         = @promedio_general,
               asistencia               = @asistencia,
               observaciones_academicas = @observaciones_academicas,
               fecha_actualizacion      = @fecha_actualizacion
         WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM historial_academico WHERE id = @id`);
  }
}

module.exports = HistorialModel;
