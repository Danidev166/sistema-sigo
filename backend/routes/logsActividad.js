const express = require('express');
const router = express.Router();
const logsActividadController = require('../controller/logsActividadController');
const logsActividadValidator = require('../validators/logsActividadValidator');
const validateBody = require('../middleware/validateBody');

// GET todos los logs
router.get('/', logsActividadController.obtenerTodos);

// GET log por ID
router.get('/:id', logsActividadController.obtenerPorId);

// POST crear log
router.post('/', validateBody(logsActividadValidator), logsActividadController.crear);

// DELETE eliminar log
router.delete('/:id', logsActividadController.eliminar);

module.exports = router; 