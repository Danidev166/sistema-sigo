const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const controller = require("../controller/asistenciaController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/asistenciaValidator");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");
const { smartCache } = require("../middleware/smartCache");

// Protege todo el módulo
router.use(verifyToken);

// 🚀 Ruta de gráfico (debe ir antes que las genéricas)
router.get("/graficos/asistencia-mensual", smartCache, controller.asistenciaMensual);

// 📊 Ruta de estadísticas (cache inteligente)
router.get("/estadisticas/:id", smartCache, controller.obtenerEstadisticas);

// 📋 Ruta para obtener asistencia por estudiante
router.get("/estudiante/:id", cacheMiddleware(180), controller.obtenerPorEstudiante);

// CRUD clásico
router.post("/", validateBody(schema), controller.crear);
router.get("/", cacheMiddleware(180), controller.obtenerTodos);
router.get("/:id", cacheMiddleware(180), controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
