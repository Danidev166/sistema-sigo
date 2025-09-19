const Joi = require("joi");

const crearEntregaSchema = Joi.object({
  id_estudiante: Joi.number().integer().required().messages({
    "any.required": "El ID del estudiante es obligatorio",
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero"
  }),
  id_recurso: Joi.number().integer().required().messages({
    "any.required": "El ID del recurso es obligatorio",
    "number.base": "El ID del recurso debe ser un número",
    "number.integer": "El ID del recurso debe ser un número entero"
  }),
  cantidad_entregada: Joi.number().integer().min(1).required().messages({
    "any.required": "La cantidad entregada es obligatoria",
    "number.base": "La cantidad debe ser un número",
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad mínima es 1"
  }),
  fecha_entrega: Joi.date().allow(null).default(new Date()).messages({
    "date.base": "La fecha de entrega debe ser una fecha válida"
  }),
  observaciones: Joi.string().allow("", null).default("").messages({
    "string.base": "Las observaciones deben ser texto"
  })
});

const actualizarEntregaSchema = Joi.object({
  id_estudiante: Joi.number().integer().messages({
    "number.base": "El ID del estudiante debe ser un número",
    "number.integer": "El ID del estudiante debe ser un número entero"
  }),
  id_recurso: Joi.number().integer().messages({
    "number.base": "El ID del recurso debe ser un número",
    "number.integer": "El ID del recurso debe ser un número entero"
  }),
  cantidad_entregada: Joi.number().integer().min(1).messages({
    "number.base": "La cantidad debe ser un número",
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad mínima es 1"
  }),
  fecha_entrega: Joi.date().messages({
    "date.base": "La fecha de entrega debe ser una fecha válida"
  }),
  observaciones: Joi.string().allow("", null).messages({
    "string.base": "Las observaciones deben ser texto"
  })
}).min(1).messages({
  "object.min": "Debe proporcionar al menos un campo para actualizar"
});

module.exports = {
  crearEntregaSchema,
  actualizarEntregaSchema
};
