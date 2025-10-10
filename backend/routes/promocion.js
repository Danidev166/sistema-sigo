const express = require('express');
const router = express.Router();
const PromocionController = require('../controller/promocionController');
const verifyToken = require('../middleware/verifyToken');

// Proteger todas las rutas
router.use(verifyToken);

// Obtener reporte de promoción por curso
router.get('/reporte', PromocionController.obtenerReportePromocion);

// Obtener estudiantes que requieren decisión manual
router.get('/pendientes', PromocionController.obtenerEstudiantesPendientes);

// Obtener estadísticas de promoción
router.get('/estadisticas', PromocionController.obtenerEstadisticasPromocion);

// Guardar decisión individual de promoción
router.post('/decision', PromocionController.guardarDecisionIndividual);

// Procesar promoción masiva
router.post('/masiva', PromocionController.procesarPromocionMasiva);

// Exportar reporte a PDF
router.get('/exportar-pdf', PromocionController.exportarReportePDF);

module.exports = router;
