const express = require("express");
const router = express.Router();
const ReportesMejoradoController = require("../controller/reportesMejoradoController");
const verifyToken = require("../middleware/verifyToken");

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// 📊 Reportes de Datos Reales
router.get("/estudiantes-por-curso", ReportesMejoradoController.estudiantesPorCurso);
router.get("/institucional", ReportesMejoradoController.reporteInstitucional);
router.get("/asistencia", ReportesMejoradoController.reporteAsistencia);

// 📈 Dashboard y KPIs
router.get("/dashboard", ReportesMejoradoController.dashboard);

// 📊 Gráficos
router.get("/graficos/asistencia-mensual", ReportesMejoradoController.graficoAsistenciaMensual);
router.get("/graficos/motivos-entrevistas", ReportesMejoradoController.graficoMotivosEntrevistas);

module.exports = router;
