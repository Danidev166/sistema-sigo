const express = require("express");
const router = express.Router();
const UsuarioController = require("../controller/usuarioController");
const verifyToken = require("../middleware/verifyToken");
const {
  validarCreacionUsuario,
  validarActualizacionUsuario
} = require("../middleware/usuariosValidatorMiddleware");

router.get("/", verifyToken, UsuarioController.listar);
router.get("/:id", verifyToken, UsuarioController.obtener);
router.post("/", verifyToken, validarCreacionUsuario, UsuarioController.crear);
router.put("/:id", verifyToken, validarActualizacionUsuario, UsuarioController.actualizar);
router.patch("/:id/estado", verifyToken, UsuarioController.actualizarEstado);
router.delete("/:id", verifyToken, UsuarioController.eliminar);

module.exports = router;
