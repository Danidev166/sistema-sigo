const Joi = require("joi");

const evaluacionSchema = Joi.object({
  id_estudiante: Joi.number().integer().positive().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero",
    "number.positive": "El ID del estudiante debe ser un número positivo"
  }),
  tipo_evaluacion: Joi.string().min(2).max(100).trim().required().messages({
    "any.required": "El tipo de evaluación es obligatorio",
    "string.empty": "El tipo de evaluación no puede estar vacío",
    "string.min": "El tipo de evaluación debe tener al menos 2 caracteres",
    "string.max": "El tipo de evaluación no puede tener más de 100 caracteres"
  }),
  resultados: Joi.string().min(10).max(2000).trim().required().messages({
    "any.required": "Los resultados son obligatorios",
    "string.empty": "Los resultados no pueden estar vacíos",
    "string.min": "Los resultados deben tener al menos 10 caracteres",
    "string.max": "Los resultados no pueden tener más de 2000 caracteres"
  }),
  fecha_evaluacion: Joi.date().max('now').required().messages({
    "any.required": "La fecha de evaluación es obligatoria",
    "date.base": "La fecha de evaluación debe ser una fecha válida",
    "date.max": "La fecha de evaluación no puede ser futura"
  }),
  nombre_completo: Joi.string().min(2).max(255).trim().optional().allow(null, "").messages({
    "string.min": "El nombre completo debe tener al menos 2 caracteres",
    "string.max": "El nombre completo no puede tener más de 255 caracteres"
  }),
  curso: Joi.string().min(2).max(50).trim().optional().allow(null, "").messages({
    "string.min": "El curso debe tener al menos 2 caracteres",
    "string.max": "El curso no puede tener más de 50 caracteres"
  }),
});

module.exports = { evaluacionSchema };
