const express = require("express");
const router = express.Router();
const MovimientoController = require("../controller/movimientoController");
const validateBody = require("../middleware/validateBody");
const movimientoSchema = require("../validators/movimientoValidator");
const verifyToken = require("../middleware/verifyToken");

// Protege todo el módulo
router.use(verifyToken);

router.post("/", validateBody(movimientoSchema), MovimientoController.registrar);
router.get("/", MovimientoController.listar);
router.put("/:id", validateBody(movimientoSchema), MovimientoController.actualizar);
router.delete("/:id", MovimientoController.eliminar);

module.exports = router;
