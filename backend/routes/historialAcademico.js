const express = require("express");
const router = express.Router();
const HistorialController = require("../controller/historialAcademicoController");
const verifyToken = require("../middleware/verifyToken");
const validateBody = require("../middleware/validateBody");
const historialAcademicoSchema = require("../validators/historialAcademicoValidator");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");
const { smartCache } = require("../middleware/smartCache");

// Protege todo el módulo
router.use(verifyToken);

router.get("/", cacheMiddleware(300), HistorialController.obtenerTodos);
router.get("/estudiante/:id", cacheMiddleware(300), HistorialController.obtenerPorEstudiante);
router.get("/:id", cacheMiddleware(300), HistorialController.obtenerPorId);
router.post("/", validateBody(historialAcademicoSchema), HistorialController.crear);
router.put("/:id", validateBody(historialAcademicoSchema), HistorialController.actualizar);
router.delete("/:id", HistorialController.eliminar);

module.exports = router;
