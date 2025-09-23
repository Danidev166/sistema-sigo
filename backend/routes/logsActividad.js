const express = require('express');
const router = express.Router();
const logsActividadController = require('../controller/logsActividadController');
const logsActividadValidator = require('../validators/logsActividadValidator');
const validateBody = require('../middleware/validateBody');
const verifyToken = require('../middleware/verifyToken');

// Protege todo el módulo
router.use(verifyToken);

router.get('/', logsActividadController.obtenerTodos);
router.get('/:id', logsActividadController.obtenerPorId);
router.post('/', validateBody(logsActividadValidator), logsActividadController.crear);
router.delete('/:id', logsActividadController.eliminar);

module.exports = router;
