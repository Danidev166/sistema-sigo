const express = require("express");
const router = express.Router();
const MovimientoController = require("../controller/movimientoController");
const validateBody = require("../middleware/validateBody");

const movimientoSchema = require("../validators/movimientoValidator");
const { authMiddleware: verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, validateBody(movimientoSchema), MovimientoController.registrar);
router.get("/", verifyToken, MovimientoController.listar);

module.exports = router;
