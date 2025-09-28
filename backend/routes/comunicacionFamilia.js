const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const controller = require("../controller/comunicacionFamiliaController");
const {
  validarCrear,
  validarActualizar,
  validarId
} = require("../validators/comunicacionFamiliaValidator");
const {
  verificarEstudiante,
  verificarComunicacion,
  verificarPermisos,
  verificarEmailApoderado,
  logAccion,
  sanitizarDatos
} = require("../middleware/comunicacionFamiliaMiddleware");

// Protege todo el módulo
router.use(verifyToken);

// Aplicar sanitización a todas las rutas
router.use(sanitizarDatos);

// Rutas con validación y middleware específicos
router.post("/", 
  validarCrear,
  verificarEstudiante,
  verificarEmailApoderado,
  logAccion('Crear'),
  controller.crear
);

router.get("/", 
  logAccion('Consultar todas'),
  controller.obtenerTodos
);

router.get("/:id", 
  validarId,
  verificarComunicacion,
  verificarPermisos,
  logAccion('Consultar por ID'),
  controller.obtenerPorId
);

router.put("/:id", 
  validarId,
  validarActualizar,
  verificarComunicacion,
  verificarPermisos,
  verificarEmailApoderado,
  logAccion('Actualizar'),
  controller.actualizar
);

router.delete("/:id", 
  validarId,
  verificarComunicacion,
  verificarPermisos,
  logAccion('Eliminar'),
  controller.eliminar
);

module.exports = router;
