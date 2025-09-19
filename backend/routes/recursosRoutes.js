const express = require("express");
const router = express.Router();

const RecursoController = require("../controller/recursoController");
const entregaRecursoController = require("../controller/entregaRecursoController");
const validateBody = require("../middleware/validateBody");
const { authMiddleware: verifyToken } = require("../middleware/authMiddleware");
const {
  crearRecursoSchema,
  actualizarRecursoSchema,
} = require("../validators/recursoValidator");
const entregaRecursoValidator = require("../validators/entregaRecursoValidator");

// 🎁 Entregas (debe ir antes que :id)
router.get("/entregas", verifyToken, entregaRecursoController.obtenerTodas);
router.get("/entregas/:id", verifyToken, entregaRecursoController.obtenerPorId);
router.get("/entregas/estudiante/:id", verifyToken, entregaRecursoController.obtenerPorEstudiante);
router.post("/entregas", verifyToken, validateBody(entregaRecursoValidator.crear), entregaRecursoController.crear);
router.put("/entregas/:id", verifyToken, validateBody(entregaRecursoValidator.actualizar), entregaRecursoController.actualizar);
router.delete("/entregas/:id", verifyToken, entregaRecursoController.eliminar);

// 📦 Recursos
router.get("/", verifyToken, RecursoController.obtenerTodos);
router.post("/", verifyToken, validateBody(crearRecursoSchema), RecursoController.crear);
router.put("/:id", verifyToken, validateBody(actualizarRecursoSchema), RecursoController.actualizar);
router.delete("/:id", verifyToken, RecursoController.eliminar);

// ⚠️ Esta debe ir al final
router.get("/:id", verifyToken, RecursoController.obtenerPorId);

module.exports = router;
