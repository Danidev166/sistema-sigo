const express = require("express");
const router = express.Router();
const controller = require("../controller/asistenciaController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/asistenciaValidator");

// 🚀 RUTA GRAFICO ASISTENCIA MENSUAL (VA PRIMERO)
router.get("/graficos/asistencia-mensual", controller.asistenciaMensual);

// CRUD
router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
