// backend/models/evaluacionModel.js
const { sql, getPool } = require('../config/db');

function toSqlDateTime(input) {
  if (input instanceof Date) return input;
  if (!input) return new Date();
  const d = new Date(input);
  return isNaN(d) ? new Date() : d;
}

class EvaluacionModel {
  static async obtenerTodas() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM evaluaciones_vocacionales
      ORDER BY fecha_evaluacion DESC, id DESC
    `);
    return r.recordset;
  }

  static async obtenerPorEspecialidad() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT 
        curso AS especialidad,
        tipo_evaluacion,
        COUNT(*) AS total
      FROM evaluaciones_vocacionales
      GROUP BY curso, tipo_evaluacion
      ORDER BY curso, tipo_evaluacion
    `);
    return r.recordset;
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM evaluaciones_vocacionales WHERE id = @id`);
    return r.recordset[0] || null;
  }

  static async obtenerPorEstudiante(idEstudiante) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante', sql.Int, idEstudiante)
      .query(`
        SELECT *
        FROM evaluaciones_vocacionales
        WHERE id_estudiante = @id_estudiante
        ORDER BY fecha_evaluacion DESC, id DESC
      `);
    return r.recordset;
  }

  static async crear(data) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id_estudiante',   sql.Int,       data.id_estudiante)
      .input('tipo_evaluacion', sql.NVarChar,  data.tipo_evaluacion)
      .input('resultados',      sql.NVarChar,  data.resultados || '')
      .input('fecha_evaluacion',sql.DateTime,  toSqlDateTime(data.fecha_evaluacion))
      .input('nombre_completo', sql.NVarChar,  data.nombre_completo)
      .input('curso',           sql.NVarChar,  data.curso)
      .query(`
        INSERT INTO evaluaciones_vocacionales
          (id_estudiante, tipo_evaluacion, resultados, fecha_evaluacion, nombre_completo, curso)
        VALUES
          (@id_estudiante, @tipo_evaluacion, @resultados, @fecha_evaluacion, @nombre_completo, @curso)
        RETURNING *
      `);
    return r.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id',              sql.Int,      id)
      .input('id_estudiante',   sql.Int,      data.id_estudiante)
      .input('tipo_evaluacion', sql.NVarChar, data.tipo_evaluacion)
      .input('resultados',      sql.NVarChar, data.resultados || '')
      .input('fecha_evaluacion',sql.DateTime, toSqlDateTime(data.fecha_evaluacion))
      .input('nombre_completo', sql.NVarChar, data.nombre_completo)
      .input('curso',           sql.NVarChar, data.curso)
      .query(`
        UPDATE evaluaciones_vocacionales
           SET id_estudiante   = @id_estudiante,
               tipo_evaluacion = @tipo_evaluacion,
               resultados      = @resultados,
               fecha_evaluacion= @fecha_evaluacion,
               nombre_completo = @nombre_completo,
               curso           = @curso
         WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM evaluaciones_vocacionales WHERE id = @id`);
  }
}

module.exports = EvaluacionModel;
