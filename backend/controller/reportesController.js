const { sql, poolPromise } = require("../config/db");
const logger = require("../utils/logger");
const PDFDocument = require("pdfkit"); // 🚀 agregar pdfkit (asegúrate de instalarlo: npm install pdfkit)

class ReportesController {
  static async resumenEstudiante(req, res, next) {
    try {
      const { id } = req.params;
      const pool = await poolPromise;

      const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
          SELECT e.nombre, e.apellido, COUNT(a.id) AS total_asistencias,
                 AVG(h.promedio_general) AS promedio,
                 COUNT(er.id) AS entregas
          FROM Estudiantes e
          LEFT JOIN Asistencia a ON e.id = a.id_estudiante
          LEFT JOIN Historial_Academico h ON e.id = h.id_estudiante
          LEFT JOIN Entrega_Recursos er ON e.id = er.id_estudiante
          WHERE e.id = @id
          GROUP BY e.nombre, e.apellido
        `);

      if (!result.recordset.length) {
        return res.status(404).json({ error: "Estudiante no encontrado o sin datos" });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      logger.error("❌ Error al generar resumen de estudiante:", error);
      next(error);
    }
  }

 static async reporteGeneral(req, res, next) {
  try {
    const pool = await poolPromise;

    // 🚀 Query para el detalle de estudiantes (igual que tienes ahora)
    const detalleEstudiantes = await pool.request().query(`
      SELECT e.id, e.nombre, e.apellido,
             COUNT(DISTINCT a.id) AS asistencias,
             AVG(h.promedio_general) AS promedio,
             COUNT(DISTINCT er.id) AS entregas
      FROM Estudiantes e
      LEFT JOIN Asistencia a ON e.id = a.id_estudiante
      LEFT JOIN Historial_Academico h ON e.id = h.id_estudiante
      LEFT JOIN Entrega_Recursos er ON e.id = er.id_estudiante
      GROUP BY e.id, e.nombre, e.apellido
    `);

    // 🚀 Query para total entrevistas (correcto, igual que en PDF)
    const resultEntrevistas = await pool.request().query(`
      SELECT COUNT(*) AS total FROM Entrevistas
    `);
    const totalEntrevistas = resultEntrevistas.recordset[0].total;

    // 🚀 Devolver TODO junto
    res.json({
      totalEntrevistas,                          // ✅ el frontend ahora puede usar esto
      estudiantesActivos: detalleEstudiantes.recordset.length, // ✅ opcional: total estudiantes activos
      estudiantes: detalleEstudiantes.recordset   // ✅ el array de detalle (como ya tenías)
    });

  } catch (error) {
    logger.error("❌ Error al generar reporte general:", error);
    next(error);
  }
}

  static async asistenciaMensual(req, res, next) {
    try {
      const pool = await poolPromise;

      const result = await pool.request().query(`
        SELECT MONTH(fecha) AS mes, COUNT(*) AS cantidad
        FROM Asistencia
        WHERE YEAR(fecha) = YEAR(GETDATE())
        GROUP BY MONTH(fecha)
        ORDER BY mes
      `);

      res.json(result.recordset);
    } catch (error) {
      logger.error("❌ Error al generar asistencia mensual:", error);
      next(error);
    }
  }

  static async motivosEntrevistas(req, res, next) {
    try {
      const pool = await poolPromise;

      const result = await pool.request().query(`
        SELECT motivo, COUNT(*) AS cantidad
        FROM Entrevistas
        GROUP BY motivo
        ORDER BY cantidad DESC
      `);

      res.json(result.recordset);
    } catch (error) {
      logger.error("❌ Error al obtener motivos de entrevistas:", error);
      next(error);
    }
  }

  static async estudiantesAtendidos(req, res, next) {
    try {
      const pool = await poolPromise;
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      let query = `
        SELECT e.id, e.nombre, e.apellido, e.curso, ent.motivo, ent.fecha_entrevista, u.nombre AS profesional,
               (SELECT COUNT(*) FROM Entrevistas ent2 WHERE ent2.id_estudiante = e.id) AS cantidad_sesiones
        FROM Estudiantes e
        INNER JOIN Entrevistas ent ON e.id = ent.id_estudiante
        INNER JOIN Usuarios u ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      if (curso) query += ` AND e.curso = @curso`;
      if (fecha_inicio) query += ` AND ent.fecha_entrevista >= @fecha_inicio`;
      if (fecha_fin) query += ` AND ent.fecha_entrevista <= @fecha_fin`;
      if (motivo) query += ` AND ent.motivo = @motivo`;
      if (profesional) query += ` AND u.nombre = @profesional`;
      query += ` ORDER BY ent.fecha_entrevista DESC`;
      const request = pool.request();
      if (curso) request.input('curso', sql.NVarChar, curso);
      if (fecha_inicio) request.input('fecha_inicio', sql.Date, fecha_inicio);
      if (fecha_fin) request.input('fecha_fin', sql.Date, fecha_fin);
      if (motivo) request.input('motivo', sql.NVarChar, motivo);
      if (profesional) request.input('profesional', sql.NVarChar, profesional);
      const result = await request.query(query);
      res.json(result.recordset);
    } catch (error) {
      logger.error("❌ Error al obtener estudiantes atendidos:", error);
      next(error);
    }
  }

  static async reporteDerivaciones(req, res, next) {
    try {
      const pool = await poolPromise;
      const { curso, fecha_inicio, fecha_fin, motivo, profesional } = req.query;
      let query = `
        SELECT e.id, e.nombre, e.apellido, e.curso, i.accion AS motivo, i.fecha, (u.nombre + ' ' + u.apellido) AS profesional
        FROM Intervenciones i
        INNER JOIN Estudiantes e ON i.id_estudiante = e.id
        INNER JOIN Usuarios u ON i.id_profesional = u.id
        WHERE 1=1
      `;
      if (curso) query += ` AND e.curso = @curso`;
      if (fecha_inicio) query += ` AND i.fecha >= @fecha_inicio`;
      if (fecha_fin) query += ` AND i.fecha <= @fecha_fin`;
      if (motivo) query += ` AND i.accion = @motivo`;
      if (profesional) query += ` AND (u.nombre + ' ' + u.apellido) = @profesional`;
      query += ` ORDER BY i.fecha DESC`;
      const request = pool.request();
      if (curso) request.input('curso', sql.NVarChar, curso);
      if (fecha_inicio) request.input('fecha_inicio', sql.Date, fecha_inicio);
      if (fecha_fin) request.input('fecha_fin', sql.Date, fecha_fin);
      if (motivo) request.input('motivo', sql.NVarChar, motivo);
      if (profesional) request.input('profesional', sql.NVarChar, profesional);
      const result = await request.query(query);
      res.json(result.recordset);
    } catch (error) {
      logger.error("❌ Error al obtener reporte de derivaciones:", error);
      next(error);
    }
  }

  static async reporteEntrevistasSeguimientos(req, res, next) {
    try {
      const pool = await poolPromise;
      const { curso, fecha_inicio, fecha_fin, motivo, profesional, estado } = req.query;
      // Consulta de Entrevistas
      let queryEntrevistas = `
        SELECT e.id, e.nombre, e.apellido, e.curso, ent.fecha_entrevista AS fecha, ent.motivo, (u.nombre + ' ' + u.apellido) AS profesional, ent.estado, ent.observaciones, 'Entrevista' AS tipo
        FROM Entrevistas ent
        INNER JOIN Estudiantes e ON ent.id_estudiante = e.id
        INNER JOIN Usuarios u ON ent.id_orientador = u.id
        WHERE 1=1
      `;
      if (curso) queryEntrevistas += ` AND e.curso = @curso`;
      if (fecha_inicio) queryEntrevistas += ` AND ent.fecha_entrevista >= @fecha_inicio`;
      if (fecha_fin) queryEntrevistas += ` AND ent.fecha_entrevista <= @fecha_fin`;
      if (motivo) queryEntrevistas += ` AND ent.motivo = @motivo`;
      if (profesional) queryEntrevistas += ` AND (u.nombre + ' ' + u.apellido) = @profesional`;
      if (estado) queryEntrevistas += ` AND ent.estado = @estado`;
      queryEntrevistas += ` ORDER BY ent.fecha_entrevista DESC`;
      const requestEnt = pool.request();
      if (curso) requestEnt.input('curso', sql.NVarChar, curso);
      if (fecha_inicio) requestEnt.input('fecha_inicio', sql.Date, fecha_inicio);
      if (fecha_fin) requestEnt.input('fecha_fin', sql.Date, fecha_fin);
      if (motivo) requestEnt.input('motivo', sql.NVarChar, motivo);
      if (profesional) requestEnt.input('profesional', sql.NVarChar, profesional);
      if (estado) requestEnt.input('estado', sql.NVarChar, estado);
      const entrevistas = await requestEnt.query(queryEntrevistas);
      // Consulta de Seguimiento Psicosocial
      let querySeg = `
        SELECT e.id, e.nombre, e.apellido, e.curso, s.fecha, s.accion, (u.nombre + ' ' + u.apellido) AS profesional, NULL AS estado, s.compromiso, 'Seguimiento' AS tipo
        FROM Seguimiento_Psicosocial s
        INNER JOIN Estudiantes e ON s.id_estudiante = e.id
        INNER JOIN Usuarios u ON s.id_profesional = u.id
        WHERE 1=1
      `;
      if (curso) querySeg += ` AND e.curso = @curso`;
      if (fecha_inicio) querySeg += ` AND s.fecha >= @fecha_inicio`;
      if (fecha_fin) querySeg += ` AND s.fecha <= @fecha_fin`;
      if (motivo) querySeg += ` AND s.accion = @motivo`;
      if (profesional) querySeg += ` AND (u.nombre + ' ' + u.apellido) = @profesional`;
      querySeg += ` ORDER BY s.fecha DESC`;
      const requestSeg = pool.request();
      if (curso) requestSeg.input('curso', sql.NVarChar, curso);
      if (fecha_inicio) requestSeg.input('fecha_inicio', sql.Date, fecha_inicio);
      if (fecha_fin) requestSeg.input('fecha_fin', sql.Date, fecha_fin);
      if (motivo) requestSeg.input('motivo', sql.NVarChar, motivo);
      if (profesional) requestSeg.input('profesional', sql.NVarChar, profesional);
      const seguimientos = await requestSeg.query(querySeg);
      // Unir resultados
      const resultado = [
        ...entrevistas.recordset.map(e => ({
          id: e.id,
          nombre: e.nombre,
          apellido: e.apellido,
          curso: e.curso,
          fecha: e.fecha,
          motivo: e.motivo,
          profesional: e.profesional,
          estado: e.estado,
          observaciones: e.observaciones,
          tipo: e.tipo
        })),
        ...seguimientos.recordset.map(s => ({
          id: s.id,
          nombre: s.nombre,
          apellido: s.apellido,
          curso: s.curso,
          fecha: s.fecha,
          motivo: s.accion,
          profesional: s.profesional,
          estado: s.estado,
          observaciones: s.compromiso,
          tipo: s.tipo
        }))
      ];
      // Ordenar por fecha descendente
      resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      res.json(resultado);
    } catch (error) {
      logger.error("❌ Error al obtener reporte de entrevistas y seguimientos:", error);
      next(error);
    }
  }

  // 🚀 NUEVO: Generar PDF del reporte
  static async generarPDF(req, res, next) {
    try {
      const pool = await poolPromise;

      // 🚀 Obtener datos básicos
      const resultEstudiantes = await pool.request().query("SELECT COUNT(*) AS total FROM Estudiantes");
      const totalEstudiantes = resultEstudiantes.recordset[0].total;

      const resultEntrevistas = await pool.request().query("SELECT COUNT(*) AS total FROM Entrevistas");
      const totalEntrevistas = resultEntrevistas.recordset[0].total;

      const resultTests = await pool.request().query("SELECT COUNT(*) AS total FROM Evaluaciones_Vocacionales");
      const totalTests = resultTests.recordset[0].total;

      // 🚀 Crear PDF
      const doc = new PDFDocument();

      // Set headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte-sigo.pdf");

      // Pipe PDF
      doc.pipe(res);

      // 🚀 Contenido del PDF
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
      doc.text("Este reporte fue generado automáticamente por el sistema SIGO PRO.", { align: "left" });

      // 🚀 Footer
      doc.moveDown().moveDown();
      doc.fontSize(10).text("SIGO - Sistema Integral de Gestión de Orientación Escolar", { align: "center" });
      doc.text("© 2025 Liceo Politécnico Bicentenario Caupolicán", { align: "center" });

      // 🚀 Finalizar
      doc.end();

    } catch (error) {
      logger.error("❌ Error al generar PDF:", error);
      next(error);
    }
  }
}

module.exports = ReportesController;
