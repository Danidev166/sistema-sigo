const Joi = require('joi');

const logsActividadSchema = Joi.object({
  id_usuario: Joi.number().integer().allow(null),
  accion: Joi.string().max(100).required(),
  tabla_afectada: Joi.string().max(100).allow(null, ''),
  id_registro: Joi.number().integer().allow(null),
  datos_anteriores: Joi.string().allow(null, ''),
  datos_nuevos: Joi.string().allow(null, ''),
  ip_address: Joi.string().max(45).allow(null, ''),
  user_agent: Joi.string().max(500).allow(null, ''),
});

module.exports = logsActividadSchema; 