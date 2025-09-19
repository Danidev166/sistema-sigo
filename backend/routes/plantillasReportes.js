const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const plantillasReportesController = require('../controller/plantillasReportesController');
const { plantillasReportesSchema, plantillasReportesUpdateSchema } = require('../validators/plantillasReportesValidator');

router.use(verifyToken);

router.get('/', plantillasReportesController.obtenerTodos);
router.get('/:id', plantillasReportesController.obtenerPorId);
router.post('/', validateBody(plantillasReportesSchema), plantillasReportesController.crear);
router.put('/:id', validateBody(plantillasReportesUpdateSchema), plantillasReportesController.actualizar);
router.delete('/:id', plantillasReportesController.eliminar);

module.exports = router; 