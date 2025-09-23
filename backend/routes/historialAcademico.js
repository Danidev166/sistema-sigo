const express = require("express");
const router = express.Router();
const HistorialController = require("../controller/historialAcademicoController");
const verifyToken = require("../middleware/verifyToken");

// Protege todo el módulo
router.use(verifyToken);

router.get("/", HistorialController.obtenerTodos);
router.get("/estudiante/:id", HistorialController.obtenerPorEstudiante);
router.get("/:id", HistorialController.obtenerPorId);
router.post("/", HistorialController.crear);
router.put("/:id", HistorialController.actualizar);
router.delete("/:id", HistorialController.eliminar);

module.exports = router;
