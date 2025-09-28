const Joi = require('joi');

const comunicacionFamiliaSchema = Joi.object({
  id_estudiante: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del estudiante debe ser un número',
      'number.integer': 'El ID del estudiante debe ser un número entero',
      'number.positive': 'El ID del estudiante debe ser positivo',
      'any.required': 'El ID del estudiante es obligatorio'
    }),

  fecha_comunicacion: Joi.date().iso().max('now').required()
    .messages({
      'date.base': 'La fecha debe ser válida',
      'date.format': 'La fecha debe estar en formato ISO',
      'date.max': 'La fecha no puede ser futura',
      'any.required': 'La fecha es obligatoria'
    }),

  tipo_comunicacion: Joi.string().valid(
    'Citación a Reunión',
    'Informe Académico',
    'Alerta/Urgente',
    'Seguimiento',
    'Otro'
  ).required()
    .messages({
      'string.base': 'El tipo de comunicación debe ser texto',
      'any.only': 'El tipo de comunicación debe ser uno de: Citación a Reunión, Informe Académico, Alerta/Urgente, Seguimiento, Otro',
      'any.required': 'El tipo de comunicación es obligatorio'
    }),

  medio: Joi.string().valid(
    'Email',
    'Teléfono',
    'Presencial',
    'WhatsApp',
    'Carta'
  ).default('Email')
    .messages({
      'string.base': 'El medio debe ser texto',
      'any.only': 'El medio debe ser uno de: Email, Teléfono, Presencial, WhatsApp, Carta'
    }),

  asunto: Joi.string().min(5).max(200).required()
    .messages({
      'string.base': 'El asunto debe ser texto',
      'string.min': 'El asunto debe tener al menos 5 caracteres',
      'string.max': 'El asunto no puede exceder 200 caracteres',
      'any.required': 'El asunto es obligatorio'
    }),

  contenido: Joi.string().min(10).max(2000).required()
    .messages({
      'string.base': 'El contenido debe ser texto',
      'string.min': 'El contenido debe tener al menos 10 caracteres',
      'string.max': 'El contenido no puede exceder 2000 caracteres',
      'any.required': 'El contenido es obligatorio'
    }),

  responsable_nombre: Joi.string().min(2).max(100).optional()
    .messages({
      'string.base': 'El responsable debe ser texto',
      'string.min': 'El responsable debe tener al menos 2 caracteres',
      'string.max': 'El responsable no puede exceder 100 caracteres'
    }),

  respuesta_familia: Joi.string().max(1000).optional()
    .messages({
      'string.base': 'La respuesta debe ser texto',
      'string.max': 'La respuesta no puede exceder 1000 caracteres'
    }),

  estado: Joi.string().valid('Enviado', 'Leído', 'Respondido', 'Pendiente').default('Enviado')
    .messages({
      'string.base': 'El estado debe ser texto',
      'any.only': 'El estado debe ser uno de: Enviado, Leído, Respondido, Pendiente'
    }),

  // Campos específicos para citación a reunión
  hora_reunion: Joi.when('tipo_comunicacion', {
    is: 'Citación a Reunión',
    then: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
      .messages({
        'string.pattern.base': 'La hora debe estar en formato HH:MM'
      }),
    otherwise: Joi.string().optional()
  }),

  lugar_reunion: Joi.when('tipo_comunicacion', {
    is: 'Citación a Reunión',
    then: Joi.string().min(5).max(100).optional()
      .messages({
        'string.min': 'El lugar debe tener al menos 5 caracteres',
        'string.max': 'El lugar no puede exceder 100 caracteres'
      }),
    otherwise: Joi.string().optional()
  }),

  enviar_email: Joi.boolean().default(false)
    .messages({
      'boolean.base': 'Enviar email debe ser verdadero o falso'
    })
});

const actualizarComunicacionSchema = comunicacionFamiliaSchema.fork(
  ['id_estudiante', 'fecha_comunicacion'], 
  (schema) => schema.optional()
);

const validarCrear = (req, res, next) => {
  const { error, value } = comunicacionFamiliaSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de validación inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

const validarActualizar = (req, res, next) => {
  const { error, value } = actualizarComunicacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(detail => ({
      campo: detail.path.join('.'),
      mensaje: detail.message
    }));

    return res.status(400).json({
      error: 'Datos de validación inválidos',
      detalles: errores
    });
  }

  req.body = value;
  next();
};

const validarId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      error: 'ID de comunicación inválido',
      mensaje: 'El ID debe ser un número entero positivo'
    });
  }

  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validarCrear,
  validarActualizar,
  validarId,
  comunicacionFamiliaSchema,
  actualizarComunicacionSchema
};