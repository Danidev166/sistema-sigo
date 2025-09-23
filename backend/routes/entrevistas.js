const express = require("express");
const router = express.Router();
const EntrevistasController = require("../controller/entrevistasController");
const validateBody = require("../middleware/validateBody");
const entrevistaSchema = require("../validators/entrevistaValidator");
const verifyToken = require("../middleware/verifyToken");

// Ruta de prueba sin autenticación
router.get("/por-mes-test", EntrevistasController.obtenerPorMesTest);

// Protege todo el módulo
router.use(verifyToken);

// Rutas específicas siempre antes que /:id
router.post("/registrar-desde-agenda/:idAgenda", EntrevistasController.registrarDesdeAgenda);
router.get("/por-mes", EntrevistasController.obtenerPorMes);
router.get("/estudiante/:id", EntrevistasController.obtenerPorEstudiante);

// CRUD
router.get("/", EntrevistasController.obtenerTodas);
router.get("/:id", EntrevistasController.obtenerPorId);
router.post("/", validateBody(entrevistaSchema), EntrevistasController.crear);
router.put("/:id", validateBody(entrevistaSchema), EntrevistasController.actualizar);
router.delete("/:id", EntrevistasController.eliminar);

module.exports = router;
