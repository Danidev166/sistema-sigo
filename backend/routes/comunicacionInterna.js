const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const comunicacionInternaController = require('../controller/comunicacionInternaController');
const comunicacionInternaValidator = require('../validators/comunicacionInternaValidator');

router.use(verifyToken);

router.get('/', comunicacionInternaController.obtenerTodos);
router.get('/:id', comunicacionInternaController.obtenerPorId);
router.post('/', validateBody(comunicacionInternaValidator), comunicacionInternaController.crear);
router.put('/:id', validateBody(comunicacionInternaValidator), comunicacionInternaController.actualizar);
router.delete('/:id', comunicacionInternaController.eliminar);

module.exports = router; 