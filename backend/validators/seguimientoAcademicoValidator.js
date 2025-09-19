const Joi = require("joi");

const seguimientoAcademicoSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  asignatura: Joi.string().max(100).required(),
  nota: Joi.number().min(1).max(7).required(),
  promedio_curso: Joi.number().min(1).max(7).required(),
  fecha: Joi.date().required()
});

module.exports = seguimientoAcademicoSchema;
