const { sql, poolPromise } = require("../config/db");

const AlertasModel = {
  async generarAlertas() {
  const pool = await poolPromise;
  const currentYear = new Date().getFullYear();

  // 🚀 Asistencia baja (< 80%) → OPTIMIZADO con CTE y mejor lógica
  await pool.request().query(`
    WITH AsistenciaPromedio AS (
      SELECT 
        a.id_estudiante,
        CAST(SUM(CASE WHEN a.tipo = 'Presente' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(a.id) as promedio_asistencia
      FROM Asistencia a
      WHERE YEAR(a.fecha) = @currentYear
      GROUP BY a.id_estudiante
      HAVING CAST(SUM(CASE WHEN a.tipo = 'Presente' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(a.id) < 0.80
    )
    INSERT INTO Alertas (id_estudiante, fecha_alerta, tipo_alerta, descripcion, estado)
    SELECT
      ap.id_estudiante,
      GETDATE(),
      'Asistencia baja',
      CONCAT('Asistencia promedio: ', CAST(ROUND(ap.promedio_asistencia * 100, 1) AS VARCHAR), '%'),
      'Nueva'
    FROM AsistenciaPromedio ap
    WHERE NOT EXISTS (
      SELECT 1 FROM Alertas al
      WHERE al.id_estudiante = ap.id_estudiante
        AND al.tipo_alerta = 'Asistencia baja'
        AND YEAR(al.fecha_alerta) = @currentYear
    );
  `, { currentYear });

  // 🚀 Rendimiento académico bajo (< 4.0) → OPTIMIZADO con CTE
  await pool.request().query(`
    WITH RendimientoBajo AS (
      SELECT 
        h.id_estudiante,
        AVG(h.promedio_general) as promedio_general
      FROM Historial_Academico h
      WHERE h.promedio_general IS NOT NULL 
        AND h.promedio_general < 4.0
      GROUP BY h.id_estudiante
    )
    INSERT INTO Alertas (id_estudiante, fecha_alerta, tipo_alerta, descripcion, estado)
    SELECT
      rb.id_estudiante,
      GETDATE(),
      'Rendimiento bajo',
      CONCAT('Promedio general: ', CAST(ROUND(rb.promedio_general, 1) AS VARCHAR)),
      'Nueva'
    FROM RendimientoBajo rb
    WHERE NOT EXISTS (
      SELECT 1 FROM Alertas al
      WHERE al.id_estudiante = rb.id_estudiante
        AND al.tipo_alerta = 'Rendimiento bajo'
        AND YEAR(al.fecha_alerta) = @currentYear
    );
  `, { currentYear });



  },

  async listarAlertas() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT a.*, e.nombre, e.apellido
      FROM Alertas a
      INNER JOIN Estudiantes e ON a.id_estudiante = e.id
      ORDER BY a.fecha_alerta DESC;
    `);
    return result.recordset;
  },

  async cambiarEstado(id, nuevoEstado) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("estado", sql.NVarChar(50), nuevoEstado)
      .query(`
        UPDATE Alertas SET estado = @estado WHERE id = @id;
      `);
  },
};

module.exports = AlertasModel;
