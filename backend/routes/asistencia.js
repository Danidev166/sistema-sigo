const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const controller = require("../controller/asistenciaController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/asistenciaValidator");

// Protege todo el módulo
router.use(verifyToken);

// 🚀 Ruta de gráfico (debe ir antes que las genéricas)
router.get("/graficos/asistencia-mensual", controller.asistenciaMensual);

// 📊 Ruta de estadísticas
router.get("/estadisticas/:id", controller.obtenerEstadisticas);

// CRUD clásico
router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
