const express = require("express");
const router = express.Router();
const controller = require("../controller/conductaController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/conductaValidator");
const verifyToken = require("../middleware/verifyToken"); // Protegido

// Aplicar JWT en todas las rutas
router.use(verifyToken);

router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/estudiante/:id", controller.obtenerPorEstudiante); // ← CORRECTO
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
