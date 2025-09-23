const express = require("express");
const router = express.Router();
const controller = require("../controller/intervencionesController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/intervencionesValidator");
const verifyToken = require("../middleware/verifyToken");

// Protege todo el módulo
router.use(verifyToken);

router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
