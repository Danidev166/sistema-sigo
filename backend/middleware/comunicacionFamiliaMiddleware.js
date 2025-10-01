const ComunicacionFamiliaModel = require('../models/comunicacionFamiliaModel');
const EstudianteModel = require('../models/estudianteModel');
const logger = require('../utils/logger');

/**
 * Middleware para verificar que el estudiante existe antes de crear comunicación
 */
const verificarEstudiante = async (req, res, next) => {
  try {
    const { id_estudiante } = req.body;
    
    if (!id_estudiante) {
      return res.status(400).json({
        error: 'ID de estudiante requerido',
        mensaje: 'Debe especificar el ID del estudiante'
      });
    }

    const estudiante = await EstudianteModel.obtenerPorId(id_estudiante);
    
    if (!estudiante) {
      return res.status(404).json({
        error: 'Estudiante no encontrado',
        mensaje: `No existe un estudiante con ID ${id_estudiante}`
      });
    }

    // Agregar datos del estudiante al request para uso posterior
    req.estudiante = estudiante;
    next();
  } catch (error) {
    logger.error('❌ Error en middleware verificarEstudiante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Error al verificar el estudiante'
    });
  }
};

/**
 * Middleware para verificar que la comunicación existe
 */
const verificarComunicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const comunicacion = await ComunicacionFamiliaModel.obtenerPorId(id);
    
    if (!comunicacion) {
      return res.status(404).json({
        error: 'Comunicación no encontrada',
        mensaje: `No existe una comunicación con ID ${id}`
      });
    }

    // Agregar datos de la comunicación al request
    req.comunicacion = comunicacion;
    next();
  } catch (error) {
    logger.error('❌ Error en middleware verificarComunicacion:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Error al verificar la comunicación'
    });
  }
};

/**
 * Middleware para verificar permisos de acceso a la comunicación
 */
const verificarPermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Debe estar autenticado para acceder a esta comunicación'
      });
    }

    const comunicacion = await ComunicacionFamiliaModel.obtenerPorId(id);
    
    if (!comunicacion) {
      return res.status(404).json({
        error: 'Comunicación no encontrada',
        mensaje: `No existe una comunicación con ID ${id}`
      });
    }

    // Verificar si el usuario tiene permisos para acceder a esta comunicación
    // Por ahora, permitir acceso a todos los usuarios autenticados
    // En el futuro se puede implementar lógica más específica basada en roles
    
    req.comunicacion = comunicacion;
    next();
  } catch (error) {
    logger.error('❌ Error en middleware verificarPermisos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Error al verificar permisos'
    });
  }
};

/**
 * Middleware para verificar que el apoderado tiene email antes de enviar
 */
const verificarEmailApoderado = async (req, res, next) => {
  try {
    const { id_estudiante, enviar_email } = req.body;
    
    if (enviar_email) {
      const estudiante = await EstudianteModel.obtenerPorId(id_estudiante);
      
      if (!estudiante?.email_apoderado) {
        return res.status(400).json({
          error: 'Email del apoderado no disponible',
          mensaje: 'El estudiante no tiene email de apoderado registrado. No se puede enviar por correo.',
          codigo: 'NO_EMAIL_APODERADO'
        });
      }
    }
    
    next();
  } catch (error) {
    logger.error('❌ Error en middleware verificarEmailApoderado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Error al verificar email del apoderado'
    });
  }
};

/**
 * Middleware para logging de acciones
 */
const logAccion = (accion) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      logger.info(`📝 ${accion} comunicación familiar`, {
        usuario: userId,
        ip,
        userAgent,
        datos: req.body
      });
      
      next();
    } catch (error) {
      logger.error('❌ Error en middleware logAccion:', error);
      next(); // No fallar la operación por error de logging
    }
  };
};

/**
 * Middleware para sanitizar datos de entrada
 */
const sanitizarDatos = (req, res, next) => {
  try {
    // Asegurar que req.body existe
    if (!req.body) {
      req.body = {};
    }

    // Sanitizar strings básicos
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str.trim().replace(/[<>]/g, '');
    };

    if (req.body.asunto) {
      req.body.asunto = sanitizeString(req.body.asunto);
    }
    
    if (req.body.contenido) {
      req.body.contenido = sanitizeString(req.body.contenido);
    }
    
    if (req.body.responsable_id) {
      req.body.responsable_id = sanitizeString(req.body.responsable_id);
    }
    
    if (req.body.lugar_reunion) {
      req.body.lugar_reunion = sanitizeString(req.body.lugar_reunion);
    }

    next();
  } catch (error) {
    logger.error('❌ Error en middleware sanitizarDatos:', error);
    next(); // No fallar la operación por error de sanitización
  }
};

module.exports = {
  verificarEstudiante,
  verificarComunicacion,
  verificarPermisos,
  verificarEmailApoderado,
  logAccion,
  sanitizarDatos
};
