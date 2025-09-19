const Joi = require("joi");

const agendaSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),

  fecha: Joi.date().required(),

  hora: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "La hora debe estar en formato HH:MM (24 horas)",
    }),

  motivo: Joi.string().max(255).required(),

  profesional: Joi.string().max(100).required(),

  email_orientador: Joi.string()
    .email({ tlds: { allow: false } })
    .allow("") // ✅ permite campo vacío
    .optional()
    .messages({
      "string.email": "El correo del orientador debe ser válido",
    }),

  creado_en: Joi.date().optional(), // generado automáticamente si no se envía
});

module.exports = { agendaSchema };
