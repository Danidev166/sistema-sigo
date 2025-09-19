const Joi = require("joi");

const seguimientoSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  tipo: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  profesional: Joi.string().max(100).required(),
  subtipo: Joi.string().max(50).allow(null, ""),
  archivo: Joi.string().max(255).allow(null, ""),
  urgencias: Joi.string().max(20).allow(null, "")
});

module.exports = seguimientoSchema;
