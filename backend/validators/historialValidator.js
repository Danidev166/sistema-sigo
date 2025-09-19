// ✅ validators/historialValidator.js
const Joi = require("joi");

const historialSchema = Joi.object({
  id_estudiante: Joi.number().integer().required(),
  promedio_general: Joi.number().precision(2).min(0).max(10).required(),
  asistencia: Joi.number().precision(2).min(0).max(100).required(),
  observaciones_academicas: Joi.string().allow(null, '').max(1000),
  fecha_actualizacion: Joi.date().required()
});

module.exports = historialSchema;
