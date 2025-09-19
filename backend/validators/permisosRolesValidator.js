const Joi = require('joi');

const permisosRolesSchema = Joi.object({
  rol: Joi.string().max(50).required(),
  modulo: Joi.string().max(100).required(),
  accion: Joi.string().max(100).required(),
  permitido: Joi.boolean(),
});

module.exports = permisosRolesSchema; 