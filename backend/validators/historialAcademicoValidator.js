const Joi = require("joi");

const historialAcademicoSchema = Joi.object({
  id_estudiante: Joi.number().integer().positive().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero",
    "number.positive": "El ID del estudiante debe ser un número positivo"
  }),
  promedio_general: Joi.number().min(1.0).max(7.0).precision(1).required().messages({
    "any.required": "El promedio general es obligatorio",
    "number.base": "El promedio general debe ser un número",
    "number.min": "El promedio general mínimo es 1.0",
    "number.max": "El promedio general máximo es 7.0"
  }),
  asistencia: Joi.number().min(0).max(100).precision(1).required().messages({
    "any.required": "El porcentaje de asistencia es obligatorio",
    "number.base": "El porcentaje de asistencia debe ser un número",
    "number.min": "El porcentaje de asistencia mínimo es 0",
    "number.max": "El porcentaje de asistencia máximo es 100"
  }),
  observaciones_academicas: Joi.string().min(10).max(1000).trim().required().messages({
    "any.required": "Las observaciones académicas son obligatorias",
    "string.empty": "Las observaciones académicas no pueden estar vacías",
    "string.min": "Las observaciones académicas deben tener al menos 10 caracteres",
    "string.max": "Las observaciones académicas no pueden tener más de 1000 caracteres"
  }),
  fecha_actualizacion: Joi.date().max('now').optional().messages({
    "date.base": "La fecha de actualización debe ser una fecha válida",
    "date.max": "La fecha de actualización no puede ser futura"
  })
});

module.exports = historialAcademicoSchema;
