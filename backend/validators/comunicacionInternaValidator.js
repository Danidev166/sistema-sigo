const Joi = require('joi');

const comunicacionInternaSchema = Joi.object({
  id_remitente: Joi.number().integer().required(),
  id_destinatario: Joi.number().integer().required(),
  asunto: Joi.string().max(255).required(),
  mensaje: Joi.string().required(),
  prioridad: Joi.string().max(20),
  leida: Joi.boolean(),
  adjuntos: Joi.string().allow(null, ''),
});

module.exports = comunicacionInternaSchema; 