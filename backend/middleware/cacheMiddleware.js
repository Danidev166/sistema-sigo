const NodeCache = require('node-cache');

// Configuración del cache
const cache = new NodeCache({
  stdTTL: 300, // 5 minutos por defecto
  checkperiod: 120, // Verificar cada 2 minutos
  useClones: false, // Mejor rendimiento
  maxKeys: 1000 // Máximo 1000 entradas
});

// Middleware de cache para respuestas GET
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Solo cachear requests GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl}:${JSON.stringify(req.query)}`;
    const cachedData = cache.get(key);

    if (cachedData) {
      // Agregar headers de cache
      res.set({
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=300',
        'ETag': `"${key}-${Date.now()}"`
      });
      
      return res.json(cachedData);
    }

    // Interceptar la respuesta para guardarla en cache
    const originalJson = res.json;
    res.json = function(data) {
      // Solo cachear respuestas exitosas
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, data, ttl);
        res.set('X-Cache', 'MISS');
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware para invalidar cache
const invalidateCache = (pattern) => {
  return (req, res, next) => {
    // Invalidar cache después de operaciones que modifican datos
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const keys = cache.keys();
      const regex = new RegExp(pattern);
      
      keys.forEach(key => {
        if (regex.test(key)) {
          cache.del(key);
        }
      });
    }
    next();
  };
};

// Función para limpiar cache manualmente
const clearCache = () => {
  cache.flushAll();
};

// Función para obtener estadísticas del cache
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  clearCache,
  getCacheStats
};
