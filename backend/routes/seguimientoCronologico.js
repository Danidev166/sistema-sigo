const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const seguimientoCronologicoController = require('../controller/seguimientoCronologicoController');
const seguimientoCronologicoValidator = require('../validators/seguimientoCronologicoValidator');

router.use(verifyToken);

router.get('/', seguimientoCronologicoController.obtenerTodos);
router.get('/:id', seguimientoCronologicoController.obtenerPorId);
router.post('/', validateBody(seguimientoCronologicoValidator), seguimientoCronologicoController.crear);
router.put('/:id', validateBody(seguimientoCronologicoValidator), seguimientoCronologicoController.actualizar);
router.delete('/:id', seguimientoCronologicoController.eliminar);

module.exports = router;
