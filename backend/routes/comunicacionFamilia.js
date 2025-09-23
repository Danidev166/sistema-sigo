const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const controller = require("../controller/comunicacionFamiliaController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/comunicacionFamiliaValidator");

// Protege todo el módulo
router.use(verifyToken);

router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
