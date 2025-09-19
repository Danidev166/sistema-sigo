const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validateBody = require('../middleware/validateBody');
const permisosRolesController = require('../controller/permisosRolesController');
const permisosRolesValidator = require('../validators/permisosRolesValidator');

router.use(verifyToken);

router.get('/', permisosRolesController.obtenerTodos);
router.get('/:id', permisosRolesController.obtenerPorId);
router.post('/', validateBody(permisosRolesValidator), permisosRolesController.crear);
router.put('/:id', validateBody(permisosRolesValidator), permisosRolesController.actualizar);
router.delete('/:id', permisosRolesController.eliminar);

module.exports = router; 