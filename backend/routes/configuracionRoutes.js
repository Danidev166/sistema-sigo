const express = require('express');
const router = express.Router();

const configuracionController = require('../controller/configuracionController');
const { configuracionSchema, configuracionUpdateSchema } = require('../validators/configuracionValidator');
const validate = require('../middleware/validateBody');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Ruta de prueba sin autenticación
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas públicas (solo requieren autenticación)
router.get('/', configuracionController.listar);
router.get('/tipo/:tipo', configuracionController.obtenerPorTipo);
router.get('/estadisticas', configuracionController.obtenerEstadisticas);

// Rutas que requieren rol de administrador
router.post('/', checkRole(['Admin']), validate(configuracionSchema), configuracionController.crear);
router.put('/tipo/:tipo', checkRole(['Admin']), validate(configuracionUpdateSchema), configuracionController.actualizar);
router.delete('/:id', checkRole(['Admin']), configuracionController.eliminar);

module.exports = router;
