const Joi = require('joi');

const seguimientoCronologicoSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  fecha: Joi.date().required(),
  tipo_accion: Joi.string().max(100).required(),
  categoria: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  profesional_responsable: Joi.string().max(255).required(),
  estado: Joi.string().max(50),
  observaciones: Joi.string().allow(null, ''),
  archivos_adjuntos: Joi.string().allow(null, ''),
  prioridad: Joi.string().max(20),
});

module.exports = seguimientoCronologicoSchema; 