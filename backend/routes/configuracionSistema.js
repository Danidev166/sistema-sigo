const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const configuracionSistemaController = require('../controller/configuracionSistemaController');
const configuracionSistemaValidator = require('../validators/configuracionSistemaValidator');

router.use(verifyToken);

router.get('/', configuracionSistemaController.obtenerTodos);
router.get('/:id', configuracionSistemaController.obtenerPorId);
router.post('/', validateBody(configuracionSistemaValidator), configuracionSistemaController.crear);
router.put('/:id', validateBody(configuracionSistemaValidator), configuracionSistemaController.actualizar);
router.delete('/:id', configuracionSistemaController.eliminar);

module.exports = router; 