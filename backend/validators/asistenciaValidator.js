const Joi = require("joi");

const asistenciaSchema = Joi.object({
  id_estudiante: Joi.number().integer().positive().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero",
    "number.positive": "El ID del estudiante debe ser un número positivo"
  }),
  fecha: Joi.date().max('now').required().messages({
    "any.required": "La fecha es obligatoria",
    "date.base": "La fecha debe ser una fecha válida",
    "date.max": "La fecha no puede ser futura"
  }),
  tipo: Joi.string().valid('Presente', 'Ausente', 'Justificada', 'Pendiente').required().messages({
    "any.required": "El tipo de asistencia es obligatorio",
    "any.only": "El tipo de asistencia debe ser: Presente, Ausente, Justificada o Pendiente"
  }),
  justificacion: Joi.string().max(500).trim().optional().allow("").messages({
    "string.max": "La justificación no puede tener más de 500 caracteres"
  })
});

module.exports = asistenciaSchema;
