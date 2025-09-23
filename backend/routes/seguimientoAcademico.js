const express = require("express");
const router = express.Router();
const controller = require("../controller/seguimientoAcademicoController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/seguimientoAcademicoValidator");
const verifyToken = require("../middleware/verifyToken");

// 🔐 proteger todo
router.use(verifyToken);

// Específicas primero
router.get("/estudiante/:id", controller.obtenerPorEstudiante);

// CRUD
router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
