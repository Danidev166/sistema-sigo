const express = require("express");
const router = express.Router();
const HistorialController = require("../controller/historialAcademicoController");
const verifyToken = require("../middleware/verifyToken");
const validateBody = require("../middleware/validateBody");
const historialAcademicoSchema = require("../validators/historialAcademicoValidator");

// Protege todo el módulo
router.use(verifyToken);

router.get("/", HistorialController.obtenerTodos);
router.get("/estudiante/:id", HistorialController.obtenerPorEstudiante);
router.get("/:id", HistorialController.obtenerPorId);
router.post("/", validateBody(historialAcademicoSchema), HistorialController.crear);
router.put("/:id", validateBody(historialAcademicoSchema), HistorialController.actualizar);
router.delete("/:id", HistorialController.eliminar);

module.exports = router;
