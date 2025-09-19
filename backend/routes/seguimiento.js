const express = require("express");
const router = express.Router();

const SeguimientoController = require("../controller/seguimientoController");
const validateBody = require("../middleware/validateBody");
const seguimientoSchema = require("../validators/seguimientoValidator");
const { authMiddleware } = require("../middleware/authMiddleware");


// Rutas para seguimiento
router.get("/", authMiddleware, SeguimientoController.listar);
router.get("/estudiante/:id", authMiddleware, SeguimientoController.obtenerPorEstudiante);
router.get("/:id", authMiddleware, SeguimientoController.obtenerPorId);
router.post("/", authMiddleware, validateBody(seguimientoSchema), SeguimientoController.crear);
router.put("/:id", authMiddleware, validateBody(seguimientoSchema), SeguimientoController.actualizar);
router.delete("/:id", authMiddleware, SeguimientoController.eliminar);

module.exports = router;
