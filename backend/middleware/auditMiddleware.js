const logger = require('../utils/logger');

/**
 * Middleware de auditoría completa para SIGO
 * Registra todas las acciones importantes para trazabilidad y compliance
 */

// Almacenamiento en memoria para auditoría (en producción usar base de datos)
const auditLog = [];

const auditMiddleware = {
  /**
   * Auditoría completa de todas las acciones
   */
  fullAudit: (req, res, next) => {
    const startTime = Date.now();
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Datos de auditoría
    const auditData = {
      id: auditId,
      timestamp: new Date().toISOString(),
      userId: req.user?.id || null,
      userEmail: req.user?.email || null,
      userRole: req.user?.rol || null,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      query: req.query,
      params: req.params,
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'Bearer ***' : null,
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'referer': req.headers['referer']
      },
      startTime: startTime,
      statusCode: null,
      responseTime: null,
      success: null,
      error: null
    };
    
    // Interceptar respuesta
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
      auditData.statusCode = res.statusCode;
      auditData.responseTime = Date.now() - startTime;
      auditData.success = res.statusCode < 400;
      auditData.responseSize = data ? data.length : 0;
      
      // Registrar auditoría
      auditMiddleware.recordAudit(auditData);
      
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      auditData.statusCode = res.statusCode;
      auditData.responseTime = Date.now() - startTime;
      auditData.success = res.statusCode < 400;
      auditData.responseData = data;
      
      // Registrar auditoría
      auditMiddleware.recordAudit(auditData);
      
      return originalJson.call(this, data);
    };
    
    // Interceptar errores
    res.on('error', (error) => {
      auditData.statusCode = res.statusCode || 500;
      auditData.responseTime = Date.now() - startTime;
      auditData.success = false;
      auditData.error = {
        message: error.message,
        stack: error.stack
      };
      
      auditMiddleware.recordAudit(auditData);
    });
    
    next();
  },

  /**
   * Auditoría específica para acciones sensibles
   */
  sensitiveActions: (actions = ['CREATE', 'UPDATE', 'DELETE']) => (req, res, next) => {
    const action = req.method;
    const isSensitive = actions.includes(action);
    
    if (!isSensitive) {
      return next();
    }
    
    const auditData = {
      id: `sensitive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'SENSITIVE_ACTION',
      userId: req.user?.id || null,
      userEmail: req.user?.email || null,
      userRole: req.user?.rol || null,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
      action: action,
      resource: req.path,
      resourceId: req.params.id || null,
      oldData: null, // Se puede implementar para UPDATE
      newData: req.body,
      query: req.query,
      params: req.params,
      success: null,
      error: null
    };
    
    // Interceptar respuesta para capturar éxito/error
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      
      if (res.statusCode >= 400) {
        auditData.error = data;
      }
      
      auditMiddleware.recordAudit(auditData);
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      
      if (res.statusCode >= 400) {
        auditData.error = data;
      }
      
      auditMiddleware.recordAudit(auditData);
      return originalJson.call(this, data);
    };
    
    next();
  },

  /**
   * Auditoría de acceso a datos sensibles
   */
  dataAccess: (sensitiveFields = ['password', 'token', 'secret', 'key']) => (req, res, next) => {
    const hasSensitiveData = sensitiveFields.some(field => 
      JSON.stringify(req.body).toLowerCase().includes(field) ||
      JSON.stringify(req.query).toLowerCase().includes(field)
    );
    
    if (!hasSensitiveData) {
      return next();
    }
    
    const auditData = {
      id: `data_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'DATA_ACCESS',
      userId: req.user?.id || null,
      userEmail: req.user?.email || null,
      userRole: req.user?.rol || null,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
      method: req.method,
      url: req.originalUrl,
      sensitiveFields: sensitiveFields.filter(field => 
        JSON.stringify(req.body).toLowerCase().includes(field) ||
        JSON.stringify(req.query).toLowerCase().includes(field)
      ),
      success: null,
      statusCode: null
    };
    
    // Interceptar respuesta
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      auditMiddleware.recordAudit(auditData);
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      auditMiddleware.recordAudit(auditData);
      return originalJson.call(this, data);
    };
    
    next();
  },

  /**
   * Auditoría de cambios de configuración
   */
  configChanges: (req, res, next) => {
    const isConfigEndpoint = req.path.includes('/config') || req.path.includes('/settings');
    
    if (!isConfigEndpoint) {
      return next();
    }
    
    const auditData = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'CONFIG_CHANGE',
      userId: req.user?.id || null,
      userEmail: req.user?.email || null,
      userRole: req.user?.rol || null,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
      method: req.method,
      url: req.originalUrl,
      configChanges: req.body,
      success: null,
      statusCode: null
    };
    
    // Interceptar respuesta
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      auditMiddleware.recordAudit(auditData);
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      auditData.success = res.statusCode < 400;
      auditData.statusCode = res.statusCode;
      auditMiddleware.recordAudit(auditData);
      return originalJson.call(this, data);
    };
    
    next();
  },

  /**
   * Registrar entrada de auditoría
   */
  recordAudit: (auditData) => {
    // Agregar a la cola de auditoría
    auditLog.push(auditData);
    
    // Mantener solo los últimos 10000 registros en memoria
    if (auditLog.length > 10000) {
      auditLog.splice(0, auditLog.length - 10000);
    }
    
    // Log estructurado
    logger.info('🔍 AUDIT', auditData);
    
    // En producción, aquí se enviaría a una base de datos de auditoría
    // o a un sistema de logging centralizado como ELK Stack
  },

  /**
   * Obtener logs de auditoría
   */
  getAuditLogs: (filters = {}) => {
    let filteredLogs = [...auditLog];
    
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }
    
    if (filters.type) {
      filteredLogs = filteredLogs.filter(log => log.type === filters.type);
    }
    
    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }
    
    if (filters.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success);
    }
    
    return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Obtener estadísticas de auditoría
   */
  getAuditStats: () => {
    const stats = {
      totalLogs: auditLog.length,
      byType: {},
      byUser: {},
      byStatus: { success: 0, error: 0 },
      byMethod: {},
      recentActivity: auditLog.slice(-100) // Últimos 100 registros
    };
    
    auditLog.forEach(log => {
      // Por tipo
      stats.byType[log.type || 'GENERAL'] = (stats.byType[log.type || 'GENERAL'] || 0) + 1;
      
      // Por usuario
      const user = log.userId || 'anonymous';
      stats.byUser[user] = (stats.byUser[user] || 0) + 1;
      
      // Por estado
      if (log.success) {
        stats.byStatus.success++;
      } else {
        stats.byStatus.error++;
      }
      
      // Por método
      stats.byMethod[log.method] = (stats.byMethod[log.method] || 0) + 1;
    });
    
    return stats;
  },

  /**
   * Limpiar logs antiguos
   */
  cleanup: (olderThanDays = 30) => {
    const cutoffDate = new Date(Date.now() - (olderThanDays * 24 * 60 * 60 * 1000));
    const initialLength = auditLog.length;
    
    for (let i = auditLog.length - 1; i >= 0; i--) {
      if (new Date(auditLog[i].timestamp) < cutoffDate) {
        auditLog.splice(i, 1);
      }
    }
    
    const cleaned = initialLength - auditLog.length;
    if (cleaned > 0) {
      logger.info(`🧹 Auditoría limpiada: ${cleaned} registros antiguos eliminados`);
    }
  }
};

// Limpiar logs antiguos cada día
setInterval(() => {
  auditMiddleware.cleanup();
}, 24 * 60 * 60 * 1000);

module.exports = auditMiddleware;
