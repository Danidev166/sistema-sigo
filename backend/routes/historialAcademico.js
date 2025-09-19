const express = require("express");
const router = express.Router();
const HistorialController = require("../controller/historialAcademicoController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Asegúrate de no tener errores como paréntesis faltantes o uso indebido
router.get("/", authMiddleware, HistorialController.obtenerTodos);
router.get("/estudiante/:id", authMiddleware, HistorialController.obtenerPorEstudiante);
router.get("/:id", authMiddleware, HistorialController.obtenerPorId);
router.post("/", authMiddleware, HistorialController.crear);
router.put("/:id", authMiddleware, HistorialController.actualizar);
router.delete("/:id", authMiddleware, HistorialController.eliminar);

module.exports = router;
