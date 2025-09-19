const Joi = require("joi");

const seguimientoPsicosocialValidator = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  motivo: Joi.string().max(255).required(),
  objetivos: Joi.string().required(),
  plan_intervencion: Joi.string().allow(""),
  profesional_asignado: Joi.string().max(255).required(),
  estado: Joi.string().valid("Activo", "Cerrado", "Derivado").required(),
  observaciones: Joi.string().allow("")
});

module.exports = seguimientoPsicosocialValidator;
