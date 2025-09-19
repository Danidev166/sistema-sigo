const express = require("express");
const router = express.Router();
const controller = require("../controller/alertaController");
const verifyToken = require("../middleware/verifyToken");

// 🚀 Generar alertas
router.post("/generar", verifyToken, controller.generar);

// 🚀 Listar alertas
router.get("/", verifyToken, controller.listar);

// 🚀 Cambiar estado de alerta
router.patch("/:id/estado", verifyToken, controller.cambiarEstado);

module.exports = router;
