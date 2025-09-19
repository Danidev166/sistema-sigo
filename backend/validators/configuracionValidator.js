const Joi = require('joi');

const configuracionSchema = Joi.object({
  tipo: Joi.string().valid('institucional', 'personalizacion', 'politicas').required(),
  clave: Joi.string().max(100).required(),
  valor: Joi.string().allow('', null),
  descripcion: Joi.string().max(255).required()
});

const configuracionUpdateSchema = Joi.array().items(
  Joi.object({
    clave: Joi.string().max(100).required(),
    valor: Joi.string().allow('', null).required()
  })
);

module.exports = {
  configuracionSchema,
  configuracionUpdateSchema
};
