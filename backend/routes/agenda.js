const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const validateBody = require("../middleware/validateBody");
const AgendaController = require("../controller/agendaController");
const { agendaSchema } = require("../validators/agendaValidator");

// ✅ Obtener todas las agendas
router.get("/", verifyToken, AgendaController.obtenerTodos);

// ✅ Obtener agenda por ID
router.get("/:id", verifyToken, AgendaController.obtenerPorId);

// ✅ Crear nueva agenda
router.post("/", verifyToken, validateBody(agendaSchema), AgendaController.crear);

// ✅ Actualizar agenda existente
router.put("/:id", verifyToken, validateBody(agendaSchema), AgendaController.actualizar);

// ✅ Eliminar agenda
router.delete("/:id", verifyToken, AgendaController.eliminar);

// 🆕 Actualizar asistencia a entrevista
router.patch("/:id/asistencia", verifyToken, AgendaController.actualizarAsistencia);

module.exports = router;
