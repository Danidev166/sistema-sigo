// backend/models/alertasModel.js
const { sql, getPool } = require('../config/db');

const AlertasModel = {
  async generarAlertas() {
    const pool = await getPool();
    const currentYear = new Date().getFullYear();

    // Usa el helper de transacción del shim
    const tx = pool.transaction();
    try {
      await tx.begin();

      // 1) Asistencia baja
      await tx.request()
        .input('currentYear', sql.Int, currentYear)
        .query(`
          WITH asistencia_promedio AS (
            SELECT 
              a.id_estudiante,
              SUM(CASE WHEN a.tipo = 'Presente' THEN 1 ELSE 0 END)::float / COUNT(*) AS promedio_asistencia
            FROM asistencia a
            WHERE EXTRACT(YEAR FROM a.fecha) = @currentYear
            GROUP BY a.id_estudiante
            HAVING SUM(CASE WHEN a.tipo = 'Presente' THEN 1 ELSE 0 END)::float / COUNT(*) < 0.80
          )
          INSERT INTO alertas (id_estudiante, fecha_alerta, tipo_alerta, descripcion, estado)
          SELECT
            ap.id_estudiante,
            NOW(),
            'Asistencia baja',
            CONCAT('Asistencia promedio: ', ROUND(ap.promedio_asistencia * 100, 1), '%'),
            'Nueva'
          FROM asistencia_promedio ap
          WHERE NOT EXISTS (
            SELECT 1
            FROM alertas al
            WHERE al.id_estudiante = ap.id_estudiante
              AND al.tipo_alerta   = 'Asistencia baja'
              AND EXTRACT(YEAR FROM al.fecha_alerta) = @currentYear
          );
        `);

      // 2) Rendimiento bajo
      await tx.request()
        .input('currentYear', sql.Int, currentYear)
        .query(`
          WITH rendimiento_bajo AS (
            SELECT 
              h.id_estudiante,
              AVG(h.promedio_general) AS promedio_general
            FROM historial_academico h
            WHERE h.promedio_general IS NOT NULL
              AND h.promedio_general < 4.0
            GROUP BY h.id_estudiante
          )
          INSERT INTO alertas (id_estudiante, fecha_alerta, tipo_alerta, descripcion, estado)
          SELECT
            rb.id_estudiante,
            NOW(),
            'Rendimiento bajo',
            CONCAT('Promedio general: ', ROUND(rb.promedio_general, 1)::text),
            'Nueva'
          FROM rendimiento_bajo rb
          WHERE NOT EXISTS (
            SELECT 1
            FROM alertas al
            WHERE al.id_estudiante = rb.id_estudiante
              AND al.tipo_alerta   = 'Rendimiento bajo'
              AND EXTRACT(YEAR FROM al.fecha_alerta) = @currentYear
          );
        `);

      await tx.commit();
    } catch (err) {
      try { await tx.rollback(); } catch (_) {}
      throw err;
    }
  },

  async listarAlertas() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT a.*, e.nombre, e.apellido
      FROM alertas a
      INNER JOIN estudiantes e ON a.id_estudiante = e.id
      ORDER BY a.fecha_alerta DESC
    `);
    return result.recordset;
  },

  async cambiarEstado(id, nuevoEstado) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('estado', sql.NVarChar(50), nuevoEstado)
      .query(`
        UPDATE alertas
           SET estado = @estado
         WHERE id = @id
      `);
  },
};

module.exports = AlertasModel;
