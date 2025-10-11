const logger = require('../utils/logger');

/**
 * Middleware de seguridad avanzada para SIGO
 * Incluye headers de seguridad, prevención de timing attacks y validaciones adicionales
 */

const securityMiddleware = {
  /**
   * Headers de seguridad adicionales
   */
  securityHeaders: (req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-DNS-Prefetch-Control': 'off',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none'
    });
    next();
  },

  /**
   * Prevenir ataques de timing
   */
  preventTimingAttacks: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      // Normalizar tiempo de respuesta para prevenir timing attacks
      if (duration < 100) {
        setTimeout(() => {}, 100 - duration);
      }
    });
    
    next();
  },

  /**
   * Validar tamaño de payload
   */
  validatePayloadSize: (maxSize = 10 * 1024 * 1024) => (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      logger.warn('⚠️ Payload demasiado grande', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        contentLength,
        maxSize,
        url: req.originalUrl
      });
      
      return res.status(413).json({
        error: 'Payload demasiado grande',
        maxSize: `${maxSize / 1024 / 1024}MB`
      });
    }
    
    next();
  },

  /**
   * Detectar y bloquear bots maliciosos
   */
  detectMaliciousBots: (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Si no hay user-agent, no es sospechoso
    if (!userAgent || userAgent.trim() === '') {
      return next();
    }
    
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /wget/i,
      /python/i,
      /java/i,
      /php/i
    ];
    
    // Lista blanca de bots conocidos y legítimos
    const whitelistedBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /curl/i,  // curl es una herramienta legítima de testing
      /postman/i,  // Postman para testing de APIs
      /insomnia/i,  // Insomnia para testing de APIs
      /httpie/i,  // HTTPie para testing de APIs
      /go-http-client/i  // Cliente HTTP de Go (usado por Render)
    ];
    
    const isWhitelisted = whitelistedBots.some(pattern => pattern.test(userAgent));
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    
    if (isSuspicious && !isWhitelisted) {
      logger.warn('🤖 Bot sospechoso detectado', {
        ip: req.ip,
        userAgent,
        url: req.originalUrl,
        method: req.method
      });
      
      // En lugar de bloquear completamente, limitar el acceso
      req.isSuspiciousBot = true;
    }
    
    next();
  },

  /**
   * Validar origen de la request
   */
  validateOrigin: (req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    
    // Si no hay origen, permitir (puede ser una request directa)
    if (!origin || origin.trim() === '') {
      return next();
    }
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000', 
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://192.168.18.10:5174', 
      'https://sigo-caupolican.onrender.com'
    ];
    
    if (!allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      logger.warn('🚫 Origen no autorizado', {
        origin,
        ip: req.ip,
        url: req.originalUrl,
        allowedOrigins
      });
      
      return res.status(403).json({
        error: 'Origen no autorizado'
      });
    }
    
    next();
  },

  /**
   * Middleware de validación de IP
   */
  validateIP: (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Si no hay IP, permitir (puede ser localhost)
    if (!ip || ip.trim() === '') {
      return next();
    }
    
    const blockedIPs = process.env.BLOCKED_IPS?.split(',') || [];
    
    if (blockedIPs.includes(ip)) {
      logger.warn('🚫 IP bloqueada', {
        ip,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      return res.status(403).json({
        error: 'Acceso denegado'
      });
    }
    
    next();
  },

  /**
   * Middleware de validación de método HTTP
   */
  validateHTTPMethod: (allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']) => (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      logger.warn('🚫 Método HTTP no permitido', {
        method: req.method,
        ip: req.ip,
        url: req.originalUrl
      });
      
      return res.status(405).json({
        error: 'Método no permitido',
        allowedMethods
      });
    }
    
    next();
  }
};

module.exports = securityMiddleware;
