const Joi = require("joi");

// Esquema para CREAR usuario
const createSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  apellido: Joi.string().min(3).required(),
  rut: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid("Admin", "Orientador", "Psicologo", "AsistenteSocial", "Directivo").required()
});

// Esquema para ACTUALIZAR usuario (password opcional)
const updateSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  apellido: Joi.string().min(3).required(),
  rut: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  rol: Joi.string().valid("Admin", "Orientador", "Psicologo", "AsistenteSocial", "Directivo").required(),
  estado: Joi.string().valid("Activo", "Inactivo").required()
});

// Exportar esquemas y validadores
module.exports = {
  createSchema,
  updateSchema,
  validateCreate: (data) => createSchema.validate(data, { abortEarly: false }),
  validateUpdate: (data) => updateSchema.validate(data, { abortEarly: false })
};
