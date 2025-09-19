const Joi = require("joi");

const entrevistaSchema = Joi.object({
  id_estudiante: Joi.number().integer().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número entero",
  }),
  id_orientador: Joi.number().integer().required().messages({
    "any.required": "El ID del orientador es obligatorio",
    "number.base": "El ID del orientador debe ser un número entero",
  }),
  fecha_entrevista: Joi.date().required().messages({
    "any.required": "La fecha de la entrevista es obligatoria",
    "date.base": "La fecha debe ser válida",
  }),
  motivo: Joi.string().max(255).required().messages({
    "any.required": "El motivo es obligatorio",
    "string.max": "El motivo no debe exceder 255 caracteres",
  }),
  observaciones: Joi.string().allow("").optional().messages({
    "string.base": "Las observaciones deben ser texto",
  }),
  estado: Joi.string().valid("Pendiente", "Realizada").default("Pendiente").messages({
    "string.base": "El estado debe ser texto",
    "any.only": "El estado debe ser 'Pendiente' o 'Realizada'",
  }),
});

module.exports = entrevistaSchema;
