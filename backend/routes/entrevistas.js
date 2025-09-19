const express = require("express");
const router = express.Router();
const EntrevistasController = require("../controller/entrevistasController");
const validateBody = require("../middleware/validateBody");
const entrevistaSchema = require("../validators/entrevistaValidator");
const verifyToken = require("../middleware/verifyToken");

// ✅ NUEVA RUTA: Registrar entrevista desde Agenda
// Importante: poner antes de las rutas dinámicas /:id para que no colisione
router.post(
  "/registrar-desde-agenda/:idAgenda",
  verifyToken, // ✅ proteger la ruta
  EntrevistasController.registrarDesdeAgenda
);


// Crear entrevista
router.post("/", validateBody(entrevistaSchema), EntrevistasController.crear);

// Obtener todas las entrevistas
router.get("/", EntrevistasController.obtenerTodas);

// Obtener entrevistas por estudiante (ahora soporta ?estado=realizada)
router.get("/estudiante/:id", EntrevistasController.obtenerPorEstudiante);

// 🚀 Nueva ruta: entrevistas por mes
router.get("/por-mes", verifyToken, EntrevistasController.obtenerPorMes);


// Obtener entrevista por ID
router.get("/:id", EntrevistasController.obtenerPorId);


// Actualizar entrevista
router.put("/:id", validateBody(entrevistaSchema), EntrevistasController.actualizar);

// Eliminar entrevista
router.delete("/:id", EntrevistasController.eliminar);

module.exports = router;
