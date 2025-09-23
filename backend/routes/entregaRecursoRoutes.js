const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const entregaRecursoController = require("../controller/entregaRecursoController");
const validateBody = require("../middleware/validateBody");
const entregaRecursoValidator = require("../validators/entregaRecursoValidator");

// Protege todas las rutas de este módulo
router.use(verifyToken);

// ✅ OJO: este router se monta en "/entregas" en index.js, así que aquí NO repitas "/entregas"
router.get("/", entregaRecursoController.obtenerTodas);

// Más específica primero para evitar conflictos
router.get("/estudiante/:id", entregaRecursoController.obtenerPorEstudiante);

// Por ID (genérica)
router.get("/:id", entregaRecursoController.obtenerPorId);

router.post(
  "/",
  validateBody(entregaRecursoValidator.crear),
  entregaRecursoController.crear
);

router.put(
  "/:id",
  validateBody(entregaRecursoValidator.actualizar),
  entregaRecursoController.actualizar
);

router.delete("/:id", entregaRecursoController.eliminar);

module.exports = router;
