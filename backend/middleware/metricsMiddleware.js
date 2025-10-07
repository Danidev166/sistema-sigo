const logger = require('../utils/logger');

/**
 * Middleware de métricas y monitoreo para SIGO
 * Incluye métricas de rendimiento, uso de API y alertas
 */

// Almacenamiento en memoria para métricas (en producción usar Redis o similar)
const metrics = {
  requests: new Map(),
  endpoints: new Map(),
  errors: new Map(),
  performance: {
    totalRequests: 0,
    totalResponseTime: 0,
    slowestRequests: [],
    errorRate: 0
  }
};

const metricsMiddleware = {
  /**
   * Métricas de rendimiento por request
   */
  performanceMetrics: (req, res, next) => {
    const start = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Agregar request ID para tracking
    req.requestId = requestId;
    res.set('X-Request-ID', requestId);
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const endpoint = `${req.method} ${req.route?.path || req.path}`;
      
      // Actualizar métricas globales
      metrics.performance.totalRequests++;
      metrics.performance.totalResponseTime += duration;
      
      // Métricas por endpoint
      if (!metrics.endpoints.has(endpoint)) {
        metrics.endpoints.set(endpoint, {
          count: 0,
          totalTime: 0,
          avgTime: 0,
          errors: 0,
          lastRequest: null
        });
      }
      
      const endpointMetrics = metrics.endpoints.get(endpoint);
      endpointMetrics.count++;
      endpointMetrics.totalTime += duration;
      endpointMetrics.avgTime = endpointMetrics.totalTime / endpointMetrics.count;
      endpointMetrics.lastRequest = new Date().toISOString();
      
      // Detectar requests lentos (>2 segundos)
      if (duration > 2000) {
        metrics.performance.slowestRequests.push({
          endpoint,
          duration,
          timestamp: new Date().toISOString(),
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
        
        // Mantener solo los 10 más lentos
        metrics.performance.slowestRequests = metrics.performance.slowestRequests
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 10);
        
        logger.warn('🐌 Request lento detectado', {
          endpoint,
          duration: `${duration}ms`,
          ip: req.ip,
          requestId
        });
      }
      
      // Detectar errores
      if (res.statusCode >= 400) {
        endpointMetrics.errors++;
        metrics.performance.errorRate = (metrics.performance.errorRate + 1) / metrics.performance.totalRequests;
        
        logger.error('❌ Error en request', {
          endpoint,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
          requestId
        });
      }
      
      // Log de métricas cada 100 requests
      if (metrics.performance.totalRequests % 100 === 0) {
        logger.info('📊 Métricas de rendimiento', {
          totalRequests: metrics.performance.totalRequests,
          avgResponseTime: Math.round(metrics.performance.totalResponseTime / metrics.performance.totalRequests),
          errorRate: `${(metrics.performance.errorRate * 100).toFixed(2)}%`,
          slowestEndpoints: Array.from(metrics.endpoints.entries())
            .sort((a, b) => b[1].avgTime - a[1].avgTime)
            .slice(0, 5)
            .map(([endpoint, data]) => ({ endpoint, avgTime: `${data.avgTime}ms` }))
        });
      }
    });
    
    next();
  },

  /**
   * Métricas de uso de API por usuario
   */
  apiUsageMetrics: (req, res, next) => {
    const userId = req.user?.id || 'anonymous';
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    const key = `${userId}-${endpoint}`;
    
    if (!metrics.requests.has(key)) {
      metrics.requests.set(key, {
        count: 0,
        lastAccess: null,
        user: userId,
        endpoint: endpoint
      });
    }
    
    const userMetrics = metrics.requests.get(key);
    userMetrics.count++;
    userMetrics.lastAccess = new Date().toISOString();
    
    // Detectar uso excesivo (>100 requests por minuto)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    if (userMetrics.lastAccess && new Date(userMetrics.lastAccess) > oneMinuteAgo && userMetrics.count > 100) {
      logger.warn('⚠️ Uso excesivo de API detectado', {
        userId,
        endpoint,
        count: userMetrics.count,
        ip: req.ip
      });
    }
    
    next();
  },

  /**
   * Middleware de alertas automáticas
   */
  alerting: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      
      // Alerta por alta tasa de errores
      if (metrics.performance.totalRequests > 0) {
        const currentErrorRate = metrics.performance.errorRate;
        if (currentErrorRate > 0.1) { // >10% de errores
          logger.error('🚨 ALERTA: Alta tasa de errores', {
            errorRate: `${(currentErrorRate * 100).toFixed(2)}%`,
            totalRequests: metrics.performance.totalRequests,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Alerta por requests muy lentos
      if (duration > 5000) { // >5 segundos
        logger.error('🚨 ALERTA: Request extremadamente lento', {
          endpoint: `${req.method} ${req.path}`,
          duration: `${duration}ms`,
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
      }
      
      // Alerta por errores 5xx
      if (statusCode >= 500) {
        logger.error('🚨 ALERTA: Error del servidor', {
          statusCode,
          endpoint: `${req.method} ${req.path}`,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    next();
  },

  /**
   * Obtener métricas actuales
   */
  getMetrics: () => {
    const avgResponseTime = metrics.performance.totalRequests > 0 
      ? Math.round(metrics.performance.totalResponseTime / metrics.performance.totalRequests)
      : 0;
    
    return {
      performance: {
        totalRequests: metrics.performance.totalRequests,
        avgResponseTime: `${avgResponseTime}ms`,
        errorRate: `${(metrics.performance.errorRate * 100).toFixed(2)}%`,
        slowestRequests: metrics.performance.slowestRequests.slice(0, 5)
      },
      endpoints: Array.from(metrics.endpoints.entries()).map(([endpoint, data]) => ({
        endpoint,
        count: data.count,
        avgTime: `${Math.round(data.avgTime)}ms`,
        errors: data.errors,
        lastRequest: data.lastRequest
      })),
      topUsers: Array.from(metrics.requests.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([key, data]) => ({
          user: data.user,
          endpoint: data.endpoint,
          count: data.count,
          lastAccess: data.lastAccess
        }))
    };
  },

  /**
   * Resetear métricas
   */
  resetMetrics: () => {
    metrics.requests.clear();
    metrics.endpoints.clear();
    metrics.errors.clear();
    metrics.performance = {
      totalRequests: 0,
      totalResponseTime: 0,
      slowestRequests: [],
      errorRate: 0
    };
    logger.info('📊 Métricas reseteadas');
  }
};

module.exports = metricsMiddleware;
