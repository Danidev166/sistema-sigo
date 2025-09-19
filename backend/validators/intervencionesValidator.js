const Joi = require("joi");

module.exports = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  accion: Joi.string().allow(""),
  responsable: Joi.string().max(100).allow(""),
  fecha: Joi.date().required(),
  meta: Joi.string().max(255).allow(""),
  compromiso: Joi.string().max(255).allow(""),
  completado: Joi.boolean().required(),
  id_profesional: Joi.number().integer().allow(null)
});
