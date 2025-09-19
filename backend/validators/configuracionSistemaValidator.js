const Joi = require('joi');

const configuracionSistemaSchema = Joi.object({
  clave: Joi.string().max(100).required(),
  valor: Joi.string().required(),
  tipo: Joi.string().max(50),
  descripcion: Joi.string().max(500).allow(null, ''),
  categoria: Joi.string().max(50),
  editable: Joi.boolean(),
  modificado_por: Joi.number().integer().allow(null),
});

module.exports = configuracionSistemaSchema; 