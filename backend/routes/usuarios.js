const express = require("express");
const router = express.Router();
const UsuarioController = require("../controller/usuarioController");
const verifyToken = require("../middleware/verifyToken");
const {
  validarCreacionUsuario,
  validarActualizacionUsuario
} = require("../middleware/usuariosValidatorMiddleware");

// 🔐 proteger todo
router.use(verifyToken);

router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.obtener);
router.post("/", validarCreacionUsuario, UsuarioController.crear);
router.put("/:id", validarActualizacionUsuario, UsuarioController.actualizar);
router.patch("/:id/estado", UsuarioController.actualizarEstado);
router.delete("/:id", UsuarioController.eliminar);

module.exports = router;
