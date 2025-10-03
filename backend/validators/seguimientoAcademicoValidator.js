const Joi = require("joi");

const seguimientoAcademicoSchema = Joi.object({
  id_estudiante: Joi.number().integer().positive().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero",
    "number.positive": "El ID del estudiante debe ser un número positivo"
  }),
  asignatura: Joi.string().min(2).max(100).trim().required().messages({
    "any.required": "La asignatura es obligatoria",
    "string.empty": "La asignatura no puede estar vacía",
    "string.min": "La asignatura debe tener al menos 2 caracteres",
    "string.max": "La asignatura no puede tener más de 100 caracteres"
  }),
  nota: Joi.number().min(1.0).max(7.0).precision(1).required().messages({
    "any.required": "La nota es obligatoria",
    "number.base": "La nota debe ser un número",
    "number.min": "La nota mínima es 1.0",
    "number.max": "La nota máxima es 7.0"
  }),
  promedio_curso: Joi.number().min(1.0).max(7.0).precision(1).required().messages({
    "any.required": "El promedio del curso es obligatorio",
    "number.base": "El promedio del curso debe ser un número",
    "number.min": "El promedio del curso mínimo es 1.0",
    "number.max": "El promedio del curso máximo es 7.0"
  }),
  fecha: Joi.date().max('now').required().messages({
    "any.required": "La fecha es obligatoria",
    "date.base": "La fecha debe ser una fecha válida",
    "date.max": "La fecha no puede ser futura"
  })
});

module.exports = seguimientoAcademicoSchema;
