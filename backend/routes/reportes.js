const express = require("express");
const router = express.Router();
const ReportesController = require("../controller/reportesController");
const verifyToken = require("../middleware/verifyToken");

// Ruta de prueba sin autenticación
router.get("/test", (req, res) => {
  res.json({ message: "Ruta de reportes funcionando" });
});

// Ruta: Reporte resumen por estudiante
router.get("/estudiante/:id", verifyToken, ReportesController.resumenEstudiante);

// Ruta: Reporte general para todos los estudiantes
router.get("/general", verifyToken, ReportesController.reporteGeneral);

// Ruta: Gráfico de asistencia mensual
router.get("/graficos/asistencia-mensual", verifyToken, ReportesController.asistenciaMensual);

// Ruta: Gráfico de motivos de entrevistas
router.get("/graficos/motivos-entrevistas", verifyToken, ReportesController.motivosEntrevistas);

// Ruta: Generar PDF
router.get("/generar-pdf", verifyToken, ReportesController.generarPDF);

// Reporte de Estudiantes Atendidos
router.get("/atendidos", verifyToken, ReportesController.estudiantesAtendidos);

// Reporte de Derivaciones (Intervenciones)
router.get("/derivaciones", verifyToken, ReportesController.reporteDerivaciones);

// Reporte combinado de Entrevistas y Seguimientos Psicosociales
router.get("/entrevistas-seguimientos", verifyToken, ReportesController.reporteEntrevistasSeguimientos);

module.exports = router;
