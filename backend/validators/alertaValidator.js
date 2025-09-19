const Joi = require("joi");

const alertaValidator = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha_alerta: Joi.date().optional(),
  tipo_alerta: Joi.string().max(50).required(),
  descripcion: Joi.string().allow("").max(255).optional(),
  estado: Joi.string().valid("Activa", "Atendida", "Cerrada").default("Activa"),
  creada_por: Joi.number().integer().optional(),
});

module.exports = alertaValidator;
