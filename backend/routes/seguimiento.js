const express = require("express");
const router = express.Router();

const SeguimientoController = require("../controller/seguimientoController");
const validateBody = require("../middleware/validateBody");
const seguimientoSchema = require("../validators/seguimientoValidator");
const verifyToken = require("../middleware/verifyToken");

// 🔐 proteger todo
router.use(verifyToken);

// Rutas (específicas primero)
router.get("/", SeguimientoController.listar);
router.get("/estudiante/:id", SeguimientoController.obtenerPorEstudiante);
router.get("/:id", SeguimientoController.obtenerPorId);
router.post("/", validateBody(seguimientoSchema), SeguimientoController.crear);
router.put("/:id", validateBody(seguimientoSchema), SeguimientoController.actualizar);
router.delete("/:id", SeguimientoController.eliminar);

module.exports = router;
