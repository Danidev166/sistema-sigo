const express = require("express");
const router = express.Router();
const controller = require("../controller/seguimientoAcademicoController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/seguimientoAcademicoValidator");
const verifyToken = require("../middleware/verifyToken");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");
const { smartCache } = require("../middleware/smartCache");

// 🔐 proteger todo
router.use(verifyToken);

// Específicas primero
router.get("/estudiante/:id", cacheMiddleware(180), controller.obtenerPorEstudiante);
router.get("/estadisticas/:id", smartCache, controller.obtenerEstadisticas);

// CRUD
router.post("/", validateBody(schema), controller.crear);
router.get("/", cacheMiddleware(180), controller.obtenerTodos);
router.get("/:id", cacheMiddleware(180), controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
