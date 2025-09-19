const express = require("express");
const router = express.Router();

const evaluacionController = require("../controller/evaluacionesController"); // ojo: "controllers", no "controller"
const validateBody = require("../middleware/validateBody");
const { evaluacionSchema } = require("../validators/evaluacionValidator");

// Rutas CRUD
router.get("/", evaluacionController.listar);
router.get("/por-especialidad", evaluacionController.obtenerPorEspecialidad);
router.get("/:id", evaluacionController.obtener);
router.post("/", validateBody(evaluacionSchema), evaluacionController.crear);
router.put(
  "/:id",
  validateBody(evaluacionSchema),
  evaluacionController.actualizar
);
router.delete("/:id", evaluacionController.eliminar);

// Ruta para enviar test por email
router.post("/enviar-email", evaluacionController.enviarTestPorEmail);

module.exports = router;
