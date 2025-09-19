const Joi = require('joi');

// Middleware para validación de entrada mejorada
const validateInput = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: '❌ Datos de entrada inválidos',
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }

    // Reemplazar los datos con los validados y sanitizados
    req[property] = value;
    next();
  };
};

// Sanitización de strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

// Middleware de sanitización general
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Esquemas de validación comunes
const commonSchemas = {
  id: Joi.number().integer().positive().required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  rut: Joi.string().pattern(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/).required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s-()]{8,15}$/).optional(),
  name: Joi.string().min(2).max(100).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).required(),
  text: Joi.string().max(1000).optional(),
  date: Joi.date().iso().optional(),
  boolean: Joi.boolean().optional(),
  integer: Joi.number().integer().optional(),
  positiveInteger: Joi.number().integer().positive().optional()
};

module.exports = {
  validateInput,
  sanitizeInput,
  commonSchemas
};
