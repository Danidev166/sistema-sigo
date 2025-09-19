const Joi = require("joi");

module.exports = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  observacion: Joi.string().allow(""),
  categoria: Joi.string().max(50).required()
});
