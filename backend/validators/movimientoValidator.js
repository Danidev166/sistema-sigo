const Joi = require("joi");

const movimientoSchema = Joi.object({
  id_recurso: Joi.number().integer().required(),
  tipo_movimiento: Joi.string().valid("entrada", "salida").required(),
  cantidad: Joi.number().integer().min(1).required(),
  observaciones: Joi.string().allow(null, "").optional(),
  id_estudiante: Joi.number().integer().allow(null),
  responsable: Joi.string().allow(null, "").optional()
});

module.exports = movimientoSchema;
