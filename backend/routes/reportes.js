const express = require("express");
const router = express.Router();
const ReportesController = require("../controller/reportesController");
const verifyToken = require("../middleware/verifyToken");

// test sin auth (ok)
router.get("/test", (req, res) => {
  res.json({ message: "Ruta de reportes funcionando" });
});

// 🔐 resto con auth
router.use(verifyToken);

// Reportes
router.get("/estudiante/:id", ReportesController.resumenEstudiante);
router.get("/general", ReportesController.reporteGeneral);

// Gráficos
router.get("/graficos/asistencia-mensual", ReportesController.asistenciaMensual);
router.get("/graficos/motivos-entrevistas", ReportesController.motivosEntrevistas);

// PDF
router.get("/generar-pdf", ReportesController.generarPDF);

// Extra
router.get("/atendidos", ReportesController.estudiantesAtendidos);
router.get("/derivaciones", ReportesController.reporteDerivaciones);
router.get("/entrevistas-seguimientos", ReportesController.reporteEntrevistasSeguimientos);

module.exports = router;
