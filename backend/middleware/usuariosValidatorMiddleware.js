const {
  validateCreate,
  validateUpdate,
} = require("../validators/usuarioValidator");

exports.validarCreacionUsuario = (req, res, next) => {
  const { error } = validateCreate(req.body);
  if (error) {
    console.log("❌ Error de validación:", error.details[0].message);
    return res.status(400).json({ mensaje: error.details[0].message });
  }
  next();
};

exports.validarActualizacionUsuario = (req, res, next) => {
  const { error } = validateUpdate(req.body);
  if (error) {
    console.log("❌ Error de validación:", error.details[0].message);
    return res.status(400).json({ mensaje: error.details[0].message });
  }
  next();
};
