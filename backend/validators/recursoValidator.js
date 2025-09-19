const Joi = require("joi");

const crearRecursoSchema = Joi.object({
  nombre: Joi.string().max(150).required(),
  descripcion: Joi.string().allow("", null).optional(),
  tipo_recurso: Joi.string().max(50).required()
});

const actualizarRecursoSchema = Joi.object({
  nombre: Joi.string().max(150),
  descripcion: Joi.string().allow("", null),
  tipo_recurso: Joi.string().max(50)
}).min(1);

module.exports = {
  crearRecursoSchema,
  actualizarRecursoSchema
};
