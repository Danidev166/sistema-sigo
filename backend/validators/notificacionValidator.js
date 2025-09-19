const Joi = require('joi');

const notificacionSchema = Joi.object({
  id_usuario: Joi.number().integer().required(),
  tipo: Joi.string().max(50).required(),
  titulo: Joi.string().max(255).required(),
  mensaje: Joi.string().required(),
  prioridad: Joi.string().max(20),
  categoria: Joi.string().max(50).required(),
  id_estudiante: Joi.number().integer().allow(null),
  fecha_limite: Joi.date().allow(null),
  leida: Joi.boolean(),
  accion_requerida: Joi.string().max(100).allow(null, ''),
});

const marcarLeidaSchema = Joi.object({
  leida: Joi.boolean().required(),
});

module.exports = {
  notificacionSchema,
  marcarLeidaSchema
}; 