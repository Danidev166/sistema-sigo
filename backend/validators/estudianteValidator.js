const Joi = require("joi");

// Esquema para un estudiante individual
const estudianteSchema = Joi.object({
  nombre: Joi.string().max(100).required(),
  apellido: Joi.string().max(100).required(),
  rut: Joi.string().max(20).required(),
  email: Joi.string().email().max(100).allow(null, ""),
  telefono: Joi.string().max(20).allow(null, ""),
  direccion: Joi.string().max(255).required(),
  fechaNacimiento: Joi.date().required(), // Cambiado a camelCase
  curso: Joi.string().max(50).allow(null, ""),
  especialidad: Joi.string().max(100).allow(null, ""),
  situacion_economica: Joi.string().max(50).allow(null, ""),
  fecha_registro: Joi.date().default(() => new Date()),
  estado: Joi.string().max(20).allow(null, ""),
  // Campos de apoderado
  nombreApoderado: Joi.string().max(100).allow(null, ""),
  telefonoApoderado: Joi.string().max(20).allow(null, ""),
  emailApoderado: Joi.string().email().max(100).allow(null, "")
});

// Esquema para carga masiva: array de estudiantes
const estudianteValidator = {
  unico: estudianteSchema,
  masivo: Joi.array().items(estudianteSchema).min(1).required()
};

module.exports = estudianteValidator;
