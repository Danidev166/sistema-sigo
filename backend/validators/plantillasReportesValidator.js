const Joi = require('joi');

const plantillasReportesSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  descripcion: Joi.string().allow(null, ''),
  tipo_reporte: Joi.string().max(50).required(),
  configuracion: Joi.string().required(),
  activa: Joi.boolean().default(true),
  creado_por: Joi.number().integer().optional(),
});

const plantillasReportesUpdateSchema = Joi.object({
  nombre: Joi.string().max(255).optional(),
  descripcion: Joi.string().allow(null, '').optional(),
  tipo_reporte: Joi.string().max(50).optional(),
  configuracion: Joi.string().optional(),
  activa: Joi.boolean().optional(),
  creado_por: Joi.number().integer().optional(),
  // Permitir columnas para el frontend (se convertirán a configuracion)
  columnas: Joi.array().items(Joi.string()).optional(),
}).custom((value, helpers) => {
  // Si no hay configuracion pero hay columnas, está bien
  if (!value.configuracion && value.columnas) {
    return value;
  }
  // Si hay configuracion, está bien
  if (value.configuracion) {
    return value;
  }
  // Si no hay ni configuracion ni columnas, es un error
  if (!value.configuracion && !value.columnas) {
    return helpers.error('custom.configuracionRequired');
  }
  return value;
}).messages({
  'custom.configuracionRequired': 'Se requiere configuracion o columnas'
});

module.exports = {
  plantillasReportesSchema,
  plantillasReportesUpdateSchema
}; 