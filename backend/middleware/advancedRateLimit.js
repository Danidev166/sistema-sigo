const logger = require('../utils/logger');

/**
 * Middleware de rate limiting avanzado para SIGO
 * Incluye rate limiting por usuario, IP, endpoint y ventanas deslizantes
 */

// Almacenamiento en memoria para rate limiting (en producción usar Redis)
const rateLimitStore = new Map();

const advancedRateLimit = {
  /**
   * Rate limiting por usuario autenticado
   */
  perUser: (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    return (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        return next(); // No aplicar rate limit a usuarios no autenticados
      }
      
      const now = Date.now();
      const key = `user:${userId}`;
      const userLimit = rateLimitStore.get(key) || { 
        count: 0, 
        resetTime: now + windowMs,
        requests: []
      };
      
      // Limpiar requests antiguos
      userLimit.requests = userLimit.requests.filter(time => now - time < windowMs);
      
      if (userLimit.requests.length >= maxRequests) {
        logger.warn('🚫 Rate limit excedido por usuario', {
          userId,
          count: userLimit.requests.length,
          maxRequests,
          ip: req.ip,
          endpoint: `${req.method} ${req.path}`
        });
        
        return res.status(429).json({
          error: 'Demasiadas solicitudes',
          message: `Máximo ${maxRequests} requests por ${windowMs / 1000 / 60} minutos`,
          retryAfter: Math.ceil((userLimit.requests[0] + windowMs - now) / 1000)
        });
      }
      
      userLimit.requests.push(now);
      rateLimitStore.set(key, userLimit);
      
      // Headers informativos
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': maxRequests - userLimit.requests.length,
        'X-RateLimit-Reset': new Date(userLimit.requests[0] + windowMs).toISOString()
      });
      
      next();
    };
  },

  /**
   * Rate limiting por IP
   */
  perIP: (windowMs = 15 * 60 * 1000, maxRequests = 200) => {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const key = `ip:${ip}`;
      const ipLimit = rateLimitStore.get(key) || { 
        count: 0, 
        resetTime: now + windowMs,
        requests: []
      };
      
      // Limpiar requests antiguos
      ipLimit.requests = ipLimit.requests.filter(time => now - time < windowMs);
      
      if (ipLimit.requests.length >= maxRequests) {
        logger.warn('🚫 Rate limit excedido por IP', {
          ip,
          count: ipLimit.requests.length,
          maxRequests,
          userAgent: req.headers['user-agent'],
          endpoint: `${req.method} ${req.path}`
        });
        
        return res.status(429).json({
          error: 'Demasiadas solicitudes desde esta IP',
          message: `Máximo ${maxRequests} requests por ${windowMs / 1000 / 60} minutos`,
          retryAfter: Math.ceil((ipLimit.requests[0] + windowMs - now) / 1000)
        });
      }
      
      ipLimit.requests.push(now);
      rateLimitStore.set(key, ipLimit);
      
      next();
    };
  },

  /**
   * Rate limiting por endpoint específico
   */
  perEndpoint: (endpoint, windowMs = 5 * 60 * 1000, maxRequests = 50) => {
    return (req, res, next) => {
      const endpointPath = req.route?.path || req.path;
      if (endpointPath !== endpoint) {
        return next();
      }
      
      const userId = req.user?.id || req.ip;
      const now = Date.now();
      const key = `endpoint:${endpoint}:${userId}`;
      const endpointLimit = rateLimitStore.get(key) || { 
        count: 0, 
        resetTime: now + windowMs,
        requests: []
      };
      
      // Limpiar requests antiguos
      endpointLimit.requests = endpointLimit.requests.filter(time => now - time < windowMs);
      
      if (endpointLimit.requests.length >= maxRequests) {
        logger.warn('🚫 Rate limit excedido por endpoint', {
          endpoint,
          userId: req.user?.id || 'anonymous',
          ip: req.ip,
          count: endpointLimit.requests.length,
          maxRequests
        });
        
        return res.status(429).json({
          error: 'Demasiadas solicitudes a este endpoint',
          message: `Máximo ${maxRequests} requests por ${windowMs / 1000 / 60} minutos`,
          retryAfter: Math.ceil((endpointLimit.requests[0] + windowMs - now) / 1000)
        });
      }
      
      endpointLimit.requests.push(now);
      rateLimitStore.set(key, endpointLimit);
      
      next();
    };
  },

  /**
   * Rate limiting adaptativo basado en carga del servidor
   */
  adaptive: (baseWindowMs = 15 * 60 * 1000, baseMaxRequests = 100) => {
    return (req, res, next) => {
      const userId = req.user?.id || req.ip;
      const now = Date.now();
      
      // Calcular carga del servidor (simplificado)
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      const loadFactor = memoryUsage.heapUsed / memoryUsage.heapTotal;
      
      // Ajustar límites basado en carga
      let adjustedMaxRequests = baseMaxRequests;
      let adjustedWindowMs = baseWindowMs;
      
      if (loadFactor > 0.8) {
        adjustedMaxRequests = Math.floor(baseMaxRequests * 0.5); // Reducir a la mitad
        adjustedWindowMs = baseWindowMs * 1.5; // Aumentar ventana
      } else if (loadFactor > 0.6) {
        adjustedMaxRequests = Math.floor(baseMaxRequests * 0.7); // Reducir 30%
      }
      
      const key = `adaptive:${userId}`;
      const adaptiveLimit = rateLimitStore.get(key) || { 
        count: 0, 
        resetTime: now + adjustedWindowMs,
        requests: []
      };
      
      // Limpiar requests antiguos
      adaptiveLimit.requests = adaptiveLimit.requests.filter(time => now - time < adjustedWindowMs);
      
      if (adaptiveLimit.requests.length >= adjustedMaxRequests) {
        logger.warn('🚫 Rate limit adaptativo excedido', {
          userId,
          count: adaptiveLimit.requests.length,
          maxRequests: adjustedMaxRequests,
          loadFactor: loadFactor.toFixed(2),
          ip: req.ip
        });
        
        return res.status(429).json({
          error: 'Demasiadas solicitudes (límite adaptativo)',
          message: `Máximo ${adjustedMaxRequests} requests por ${adjustedWindowMs / 1000 / 60} minutos`,
          retryAfter: Math.ceil((adaptiveLimit.requests[0] + adjustedWindowMs - now) / 1000),
          loadFactor: loadFactor.toFixed(2)
        });
      }
      
      adaptiveLimit.requests.push(now);
      rateLimitStore.set(key, adaptiveLimit);
      
      next();
    };
  },

  /**
   * Rate limiting para endpoints de autenticación (más estricto)
   */
  authEndpoints: (windowMs = 15 * 60 * 1000, maxRequests = 5) => {
    return (req, res, next) => {
      const isAuthEndpoint = req.path.includes('/auth') || req.path.includes('/login');
      if (!isAuthEndpoint) {
        return next();
      }
      
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const key = `auth:${ip}`;
      const authLimit = rateLimitStore.get(key) || { 
        count: 0, 
        resetTime: now + windowMs,
        requests: []
      };
      
      // Limpiar requests antiguos
      authLimit.requests = authLimit.requests.filter(time => now - time < windowMs);
      
      if (authLimit.requests.length >= maxRequests) {
        logger.error('🚨 Rate limit excedido en autenticación', {
          ip,
          count: authLimit.requests.length,
          maxRequests,
          userAgent: req.headers['user-agent'],
          endpoint: `${req.method} ${req.path}`
        });
        
        return res.status(429).json({
          error: 'Demasiados intentos de autenticación',
          message: `Máximo ${maxRequests} intentos por ${windowMs / 1000 / 60} minutos`,
          retryAfter: Math.ceil((authLimit.requests[0] + windowMs - now) / 1000)
        });
      }
      
      authLimit.requests.push(now);
      rateLimitStore.set(key, authLimit);
      
      next();
    };
  },

  /**
   * Obtener estadísticas de rate limiting
   */
  getStats: () => {
    const stats = {
      totalKeys: rateLimitStore.size,
      byType: {
        user: 0,
        ip: 0,
        endpoint: 0,
        adaptive: 0,
        auth: 0
      }
    };
    
    for (const [key, data] of rateLimitStore.entries()) {
      if (key.startsWith('user:')) stats.byType.user++;
      else if (key.startsWith('ip:')) stats.byType.ip++;
      else if (key.startsWith('endpoint:')) stats.byType.endpoint++;
      else if (key.startsWith('adaptive:')) stats.byType.adaptive++;
      else if (key.startsWith('auth:')) stats.byType.auth++;
    }
    
    return stats;
  },

  /**
   * Limpiar rate limits expirados
   */
  cleanup: () => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logger.info(`🧹 Rate limits limpiados: ${cleaned} entradas expiradas`);
    }
  }
};

// Limpiar rate limits cada 5 minutos
setInterval(() => {
  advancedRateLimit.cleanup();
}, 5 * 60 * 1000);

module.exports = advancedRateLimit;
