const Joi = require("joi");

const schema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  tipo: Joi.string().max(50).required(),
  detalle: Joi.string().allow(null, ""),
  responsable: Joi.string().max(100).allow(null, ""),
  proxima_accion: Joi.string().max(255).allow(null, "")
});

module.exports = schema;
