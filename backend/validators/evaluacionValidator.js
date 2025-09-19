const Joi = require("joi");

const evaluacionSchema = Joi.object({
  id_estudiante: Joi.number().integer().required().messages({
    "any.required": "El ID del estudiante es obligatorio.",
    "number.base": "El ID del estudiante debe ser un número.",
  }),
  tipo_evaluacion: Joi.string().max(100).required().messages({
    "any.required": "El tipo de evaluación es obligatorio.",
    "string.max": "El tipo de evaluación debe tener como máximo 100 caracteres.",
  }),
  resultados: Joi.string().required().messages({
    "any.required": "Los resultados son obligatorios.",
  }),
  fecha_evaluacion: Joi.date().required().messages({
    "any.required": "La fecha de evaluación es obligatoria.",
    "date.base": "La fecha de evaluación debe ser una fecha válida.",
  }),
  nombre_completo: Joi.string().max(255).optional().allow(null, "").messages({
    "string.max": "El nombre completo debe tener como máximo 255 caracteres.",
  }),
  curso: Joi.string().max(50).optional().allow(null, "").messages({
    "string.max": "El curso debe tener como máximo 50 caracteres.",
  }),
});

module.exports = { evaluacionSchema };
