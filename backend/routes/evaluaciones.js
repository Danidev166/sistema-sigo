const express = require("express");
const router = express.Router();

const evaluacionController = require("../controller/evaluacionesController");
const validateBody = require("../middleware/validateBody");
const { evaluacionSchema } = require("../validators/evaluacionValidator");
const verifyToken = require("../middleware/verifyToken");

// Ruta de prueba sin autenticación
router.get("/por-especialidad-test", evaluacionController.obtenerPorEspecialidadTest);

// Ruta pública para tests móviles (sin autenticación)
router.post("/mobile", evaluacionController.crear);

// Protege todo el módulo
router.use(verifyToken);

// Listado/consultas
router.get("/", evaluacionController.listar);
router.get("/por-especialidad", evaluacionController.obtenerPorEspecialidad);

// ⚠️ Debe ir ANTES de "/:id" o lo capturará como id
router.post("/enviar-email", evaluacionController.enviarTestPorEmail);

// CRUD
router.get("/:id", evaluacionController.obtener);
router.post("/", validateBody(evaluacionSchema), evaluacionController.crear);
router.put("/:id", validateBody(evaluacionSchema), evaluacionController.actualizar);
router.delete("/:id", evaluacionController.eliminar);

module.exports = router;
