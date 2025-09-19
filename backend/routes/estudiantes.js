// routes/estudiantes.js
const express = require("express");
const router = express.Router();

const estudianteController = require("../controller/estudianteController");
const validateBody = require("../middleware/validateBody");
const verifyToken = require("../middleware/verifyToken");
const estudianteValidator = require("../validators/estudianteValidator");
// const { smartCache, invalidateCache } = require("../middleware/smartCache");

// ✅ Rutas específicas primero (para evitar conflicto con /:id)
router.get("/activos", estudianteController.obtenerActivos);
router.get("/buscar", estudianteController.buscarPorRut);
router.get("/paginado", estudianteController.obtenerPaginado);

// ✅ Ruta para carga masiva
router.post(
  "/masivo",
  (req, res, next) => { console.log("Llega a la ruta /masivo"); next(); },
  verifyToken,
  validateBody(estudianteValidator.masivo),
  estudianteController.crearEstudiantesMasivo
);

// ✅ CRUD Estudiantes
router.get("/", estudianteController.obtenerTodos);
router.get("/:id", estudianteController.obtenerPorId);
router.post("/", validateBody(estudianteValidator.unico), estudianteController.crear);
router.put("/:id", validateBody(estudianteValidator.unico), estudianteController.actualizar);
router.delete("/:id", verifyToken, estudianteController.eliminar);

module.exports = router;
