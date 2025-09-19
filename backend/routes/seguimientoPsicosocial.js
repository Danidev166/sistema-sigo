const express = require("express");
const router = express.Router();
const controller = require("../controller/seguimientoPsicosocialController");
const validateBody = require("../middleware/validateBody");
const schema = require("../validators/seguimientoPsicosocialValidator");

// CRUD
router.post("/", validateBody(schema), controller.crear);
router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", validateBody(schema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
