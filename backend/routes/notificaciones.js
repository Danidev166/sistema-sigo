const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const notificacionController = require('../controller/notificacionController');
const { notificacionSchema, marcarLeidaSchema } = require('../validators/notificacionValidator');
// const { smartCache, invalidateCache } = require('../middleware/smartCache');

router.use(verifyToken);

router.get('/', notificacionController.obtenerTodos);
router.get('/:id', notificacionController.obtenerPorId);
router.post('/', validateBody(notificacionSchema), notificacionController.crear);
router.put('/:id', validateBody(notificacionSchema), notificacionController.actualizar);
router.put('/:id/leida', validateBody(marcarLeidaSchema), notificacionController.marcarComoLeida);
router.delete('/:id', notificacionController.eliminar);

module.exports = router; 