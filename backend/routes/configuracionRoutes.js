const express = require('express');
const router = express.Router();

const configuracionController = require('../controller/configuracionController');
const { configuracionSchema, configuracionUpdateSchema } = require('../validators/configuracionValidator');
const validate = require('../middleware/validateBody');
const verifyToken = require('../middleware/verifyToken');

// Ruta de prueba sin autenticación
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
});

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Rutas públicas (solo requieren autenticación)
router.get('/', configuracionController.listar);
router.get('/tipo/:tipo', configuracionController.obtenerPorTipo);
router.get('/estadisticas', configuracionController.obtenerEstadisticas);

// Rutas que requieren rol de administrador (simplificado por ahora)
router.post('/', validate(configuracionSchema), configuracionController.crear);
router.put('/tipo/:tipo', validate(configuracionUpdateSchema), configuracionController.actualizar);
router.delete('/:id', configuracionController.eliminar);

module.exports = router;
