// src/routes/entregaRecursoRoutes.js

const express = require("express");
const router = express.Router();
const entregaRecursoController = require("../controller/entregaRecursoController");
const validateBody = require("../middleware/validateBody");
const entregaRecursoValidator = require("../validators/entregaRecursoValidator");

// ✅ Ruta general para listar todas las entregas
router.get("/entregas", entregaRecursoController.obtenerTodas);

// ✅ Ruta para obtener entregas por estudiante (más específica primero)
router.get("/estudiante/:id", entregaRecursoController.obtenerPorEstudiante);


// ✅ Ruta para obtener una entrega por su ID
router.get("/entregas/:id", entregaRecursoController.obtenerPorId);

// ✅ Crear una entrega
router.post(
  "/entregas",
  validateBody(entregaRecursoValidator.crear),
  entregaRecursoController.crear
);

// ✅ Actualizar una entrega
router.put(
  "/entregas/:id",
  validateBody(entregaRecursoValidator.actualizar),
  entregaRecursoController.actualizar
);

// ✅ Eliminar una entrega
router.delete("/entregas/:id", entregaRecursoController.eliminar);

module.exports = router;
