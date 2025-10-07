const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const metricsMiddleware = require("../middleware/metricsMiddleware");
const auditMiddleware = require("../middleware/auditMiddleware");
const advancedRateLimit = require("../middleware/advancedRateLimit");

// Proteger todas las rutas de métricas
router.use(verifyToken);

// Rate limiting estricto para métricas
router.use(advancedRateLimit.perUser(5 * 60 * 1000, 20)); // 20 requests por 5 min

/**
 * GET /api/metrics/performance
 * Obtener métricas de rendimiento
 */
router.get("/performance", (req, res) => {
  try {
    const metrics = metricsMiddleware.getMetrics();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener métricas de rendimiento",
      details: error.message
    });
  }
});

/**
 * GET /api/metrics/audit
 * Obtener logs de auditoría
 */
router.get("/audit", (req, res) => {
  try {
    const { userId, type, startDate, endDate, success, limit = 100 } = req.query;
    
    const filters = {};
    if (userId) filters.userId = userId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (success !== undefined) filters.success = success === 'true';
    
    const auditLogs = auditMiddleware.getAuditLogs(filters).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: auditLogs,
      total: auditLogs.length,
      filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener logs de auditoría",
      details: error.message
    });
  }
});

/**
 * GET /api/metrics/audit/stats
 * Obtener estadísticas de auditoría
 */
router.get("/audit/stats", (req, res) => {
  try {
    const stats = auditMiddleware.getAuditStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener estadísticas de auditoría",
      details: error.message
    });
  }
});

/**
 * GET /api/metrics/rate-limit/stats
 * Obtener estadísticas de rate limiting
 */
router.get("/rate-limit/stats", (req, res) => {
  try {
    const stats = advancedRateLimit.getStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener estadísticas de rate limiting",
      details: error.message
    });
  }
});

/**
 * POST /api/metrics/reset
 * Resetear métricas (solo para administradores)
 */
router.post("/reset", (req, res) => {
  try {
    // Verificar que el usuario sea administrador
    if (req.user?.rol !== 'admin' && req.user?.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado. Solo administradores pueden resetear métricas."
      });
    }
    
    metricsMiddleware.resetMetrics();
    
    res.json({
      success: true,
      message: "Métricas reseteadas correctamente",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al resetear métricas",
      details: error.message
    });
  }
});

/**
 * GET /api/metrics/health
 * Health check con métricas básicas
 */
router.get("/health", (req, res) => {
  try {
    const metrics = metricsMiddleware.getMetrics();
    const auditStats = auditMiddleware.getAuditStats();
    const rateLimitStats = advancedRateLimit.getStats();
    
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: {
        totalRequests: metrics.performance.totalRequests,
        avgResponseTime: metrics.performance.avgResponseTime,
        errorRate: metrics.performance.errorRate
      },
      audit: {
        totalLogs: auditStats.totalLogs,
        successRate: auditStats.byStatus.success / (auditStats.byStatus.success + auditStats.byStatus.error) * 100
      },
      rateLimit: {
        activeLimits: rateLimitStats.totalKeys
      }
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
