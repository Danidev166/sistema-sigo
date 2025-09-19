const Joi = require("joi");

const asistenciaSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  tipo: Joi.string().max(50).required(),
  justificacion: Joi.string().allow("").max(255)
});

module.exports = asistenciaSchema;
