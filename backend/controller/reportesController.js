// controllers/reportesController.js  ✅ PostgreSQL
const { getPool } = require("../config/db");
const logger = require("../utils/logger");
const PDFDocument = require("pdfkit");

// helper mínimo para concatenar filtros seguros
const esc = (v) => String(v).replace(/'/g, "''");

class ReportesController {
  static async resumenEstudiante(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido" });

      const pool = await getPool();
      const sql = `
        SELECT e.nombre, e.apellido,
               COUNT(a.id)::int AS total_asistencias,
               ROUND(AVG(h.promedio_general)::numeric, 2) AS promedio,
               COUNT(er.id)::int AS entregas
        FROM estudiantes e
        LEFT JOIN asistencia a          ON e.id = a.id_estudiante
        LEFT JOIN historial_academico h ON e.id = h.id_estudiante
        LEFT JOIN entrega_recursos er   ON e.id = er.id_estudiante
        WHERE e.id = ${id}
        GROUP BY e.nombre, e.apellido
      `;
      const r = await pool.request().query(sql);
      if (!r.recordset.length) return res.status(404).json({ error: "Estudiante no encontrado o sin datos" });
      res.json(r.recordset[0]);
    } catch (error) {
      logger.error("❌ Error en resumenEstudiante:", error);
      next(error);
    }
  }

  static async reporteGeneral(_req, res, next) {
    try {
      const pool = await getPool();
      const detalleSql = `
        SELECT e.id, e.nombre, e.apellido,
               COUNT(DISTINCT a.id)::int    AS asistencias,
               ROUND(AVG(h.promedio_general)::numeric, 2) AS promedio,
               COUNT(DISTINCT er.id)::int   AS entregas
        FROM estudiantes e
        LEFT JOIN asistencia a          ON e.id = a.id_estudiante
        LEFT JOIN historial_academico h ON e.id = h.id_estudiante
        LEFT JOIN entrega_recursos er   ON e.id = er.id_estudiante
        GROUP BY e.id, e.nombre, e.apellido
      `;
      const entrevistasSql = `SELECT COUNT(*)::int AS total FROM entrevistas`;
      const [detalle, entrevistas] = await Promise.all([
        pool.request().query(detalleSql),
        pool.request().query(entrevistasSql),
      ]);
      res.json({
        totalEntrevistas: entrevistas.recordset[0].total,
        estudiantesActivos: detalle.recordset.length,
        estudiantes: detalle.recordset,
      });
    } catch (error) {
      logger.error("❌ Error en reporteGeneral:", error);
      next(error);
    }
  }

  static async asistenciaMensual(_req, res, next) {
    try {
      const pool = await getPool();
      const sql = `
        SELECT EXTRACT(MONTH FROM fecha)::int AS mes, COUNT(*)::int AS cantidad
        FROM asistencia
        WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY 1
        ORDER BY 1
      `;
      const r = await pool.request().query(sql);
      res.json(r.recordset);
    } catch (error) {
      logger.error("❌ Error en asistenciaMensual:", error);
      next(error);
    }
  }

  static async motivosEntrevistas(_req, res, next) {
    try {
      const pool = await getPool();
      const sql = `
        SELECT motivo, COUNT(*)::int AS cantidad
        FROM entrevistas
        GROUP BY motivo
        ORDER BY cantidad DESC
      `;
      const r = await pool.request().query(sql);
      res.json(r.recordset);
    } catch (error) {
      logger.error("❌ Error en motivosEntrevistas:", error);
      next(error);
    }
  }

  static async estudiantesAtendidos(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      const pool = await getPool();
      let sql = `
        SELECT e.id, e.nombre, e.apellido, e.curso, ent.motivo, ent.fecha_entrevista,
               (u.nombre || ' ' || u.apellido) AS profesional,
               (SELECT COUNT(*) FROM entrevistas ent2 WHERE ent2.id_estudiante = e.id)::int AS cantidad_sesiones
        FROM estudiantes e
        INNER JOIN entrevistas ent ON e.id = ent.id_estudiante
        INNER JOIN usuarios u      ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      if (curso)        sql += ` AND e.curso = '${esc(curso)}'`;
      if (fecha_inicio) sql += ` AND ent.fecha_entrevista >= '${esc(fecha_inicio)}'::timestamp`;
      if (fecha_fin)    sql += ` AND ent.fecha_entrevista <= '${esc(fecha_fin)}'::timestamp`;
      if (motivo)       sql += ` AND ent.motivo = '${esc(motivo)}'`;
      if (profesional)  sql += ` AND (u.nombre || ' ' || u.apellido) = '${esc(profesional)}'`;
      sql += ` ORDER BY ent.fecha_entrevista DESC`;

      const r = await pool.request().query(sql);
      res.json(r.recordset);
    } catch (error) {
      logger.error("❌ Error en estudiantesAtendidos:", error);
      next(error);
    }
  }

  static async reporteDerivaciones(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      const pool = await getPool();
      let sql = `
        SELECT e.id, e.nombre, e.apellido, e.curso,
               i.accion AS motivo, i.fecha,
               (u.nombre || ' ' || u.apellido) AS profesional
        FROM intervenciones i
        INNER JOIN estudiantes e ON i.id_estudiante = e.id
        INNER JOIN usuarios u    ON i.id_profesional = u.id
        WHERE 1=1
      `;
      if (curso)        sql += ` AND e.curso = '${esc(curso)}'`;
      if (fecha_inicio) sql += ` AND i.fecha >= '${esc(fecha_inicio)}'::date`;
      if (fecha_fin)    sql += ` AND i.fecha <= '${esc(fecha_fin)}'::date`;
      if (motivo)       sql += ` AND i.accion = '${esc(motivo)}'`;
      if (profesional)  sql += ` AND (u.nombre || ' ' || u.apellido) = '${esc(profesional)}'`;
      sql += ` ORDER BY i.fecha DESC`;

      const r = await pool.request().query(sql);
      res.json(r.recordset);
    } catch (error) {
      logger.error("❌ Error en reporteDerivaciones:", error);
      next(error);
    }
  }

  static async reporteEntrevistasSeguimientos(req, res, next) {
    try {
      const { curso, fecha_inicio, fecha_fin, motivo, profesional, estado } = req.query;
      const pool = await getPool();

      let qEnt = `
        SELECT e.id, e.nombre, e.apellido, e.curso,
               ent.fecha_entrevista AS fecha, ent.motivo,
               (u.nombre || ' ' || u.apellido) AS profesional,
               ent.estado, ent.observaciones, 'Entrevista' AS tipo
        FROM entrevistas ent
        INNER JOIN estudiantes e ON ent.id_estudiante = e.id
        INNER JOIN usuarios u    ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      if (curso)        qEnt += ` AND e.curso = '${esc(curso)}'`;
      if (fecha_inicio) qEnt += ` AND ent.fecha_entrevista >= '${esc(fecha_inicio)}'::timestamp`;
      if (fecha_fin)    qEnt += ` AND ent.fecha_entrevista <= '${esc(fecha_fin)}'::timestamp`;
      if (motivo)       qEnt += ` AND ent.motivo = '${esc(motivo)}'`;
      if (profesional)  qEnt += ` AND (u.nombre || ' ' || u.apellido) = '${esc(profesional)}'`;
      if (estado)       qEnt += ` AND ent.estado = '${esc(estado)}'`;
      qEnt += ` ORDER BY ent.fecha_entrevista DESC`;

      let qSeg = `
        SELECT e.id, e.nombre, e.apellido, e.curso,
               s.fecha, s.accion,
               (u.nombre || ' ' || u.apellido) AS profesional,
               NULL::text AS estado,
               s.compromiso,
               'Seguimiento' AS tipo
        FROM seguimiento_psicosocial s
        INNER JOIN estudiantes e ON s.id_estudiante = e.id
        INNER JOIN usuarios u    ON s.id_profesional = u.id
        WHERE 1=1
      `;
      if (curso)        qSeg += ` AND e.curso = '${esc(curso)}'`;
      if (fecha_inicio) qSeg += ` AND s.fecha >= '${esc(fecha_inicio)}'::date`;
      if (fecha_fin)    qSeg += ` AND s.fecha <= '${esc(fecha_fin)}'::date`;
      if (motivo)       qSeg += ` AND s.accion = '${esc(motivo)}'`;
      if (profesional)  qSeg += ` AND (u.nombre || ' ' || u.apellido) = '${esc(profesional)}'`;
      qSeg += ` ORDER BY s.fecha DESC`;

      const [rEnt, rSeg] = await Promise.all([
        pool.request().query(qEnt),
        pool.request().query(qSeg),
      ]);

      const resultado = [
        ...rEnt.recordset.map(e => ({
          id: e.id, nombre: e.nombre, apellido: e.apellido, curso: e.curso,
          fecha: e.fecha, motivo: e.motivo, profesional: e.profesional,
          estado: e.estado, observaciones: e.observaciones, tipo: e.tipo
        })),
        ...rSeg.recordset.map(s => ({
          id: s.id, nombre: s.nombre, apellido: s.apellido, curso: s.curso,
          fecha: s.fecha, motivo: s.accion, profesional: s.profesional,
          estado: s.estado, observaciones: s.compromiso, tipo: s.tipo
        }))
      ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      res.json(resultado);
    } catch (error) {
      logger.error("❌ Error en reporteEntrevistasSeguimientos:", error);
      next(error);
    }
  }

  static async generarPDF(_req, res, next) {
    try {
      const pool = await getPool();
      const q = async (sql) => (await pool.request().query(sql)).recordset[0].total;

      const totalEstudiantes  = await q("SELECT COUNT(*)::int AS total FROM estudiantes");
      const totalEntrevistas  = await q("SELECT COUNT(*)::int AS total FROM entrevistas");
      const totalTests        = await q("SELECT COUNT(*)::int AS total FROM evaluaciones_vocacionales");

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte-sigo.pdf");
      doc.pipe(res);

      doc.fontSize(20).text("Reporte SIGO PRO", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown().moveDown();
      doc.fontSize(14).text("Resumen de Datos", { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`- Total estudiantes: ${totalEstudiantes}`);
      doc.text(`- Total entrevistas: ${totalEntrevistas}`);
      doc.text(`- Total tests aplicados: ${totalTests}`);
      doc.moveDown().moveDown();
      doc.text("Este reporte fue generado automáticamente por el sistema SIGO PRO.");
      doc.moveDown().moveDown();
      doc.fontSize(10).text("SIGO - Sistema Integral de Orientación", { align: "center" });
      doc.text("© 2025 Liceo Politécnico Bicentenario Caupolicán", { align: "center" });
      doc.end();
    } catch (error) {
      logger.error("❌ Error al generar PDF:", error);
      next(error);
    }
  }
}

module.exports = ReportesController;
