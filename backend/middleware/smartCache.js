const NodeCache = require('node-cache');

// Configuración del cache inteligente
const cache = new NodeCache({
  stdTTL: 300, // 5 minutos por defecto
  checkperiod: 120, // Verificar cada 2 minutos
  useClones: false, // Mejor rendimiento
  maxKeys: 500 // Máximo 500 entradas
});

// Configuraciones específicas por endpoint
const cacheConfig = {
  '/api/estudiantes': { ttl: 180, key: 'estudiantes' },
  '/api/usuarios': { ttl: 300, key: 'usuarios' },
  '/api/notificaciones': { ttl: 60, key: 'notificaciones' },
  '/api/entrevistas': { ttl: 120, key: 'entrevistas' },
  '/api/alertas': { ttl: 60, key: 'alertas' },
  '/api/configuracion': { ttl: 600, key: 'configuracion' }, // 10 minutos
  '/api/evaluaciones': { ttl: 180, key: 'evaluaciones' }
};

// Middleware de cache inteligente
const smartCache = (req, res, next) => {
  // Solo cachear requests GET
  if (req.method !== 'GET') {
    return next();
  }

  // Buscar configuración para esta ruta
  const fullPath = req.originalUrl; // /api/estudiantes
  const config = cacheConfig[fullPath];
  
  if (!config) {
    return next(); // No cachear si no hay configuración
  }

  // Crear clave única para la consulta
  const queryString = JSON.stringify(req.query);
  const cacheKey = `${config.key}:${queryString}`;
  
  // Verificar si existe en cache
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    // Agregar headers de cache
    res.set({
      'X-Cache': 'HIT',
      'Cache-Control': `public, max-age=${Math.floor(config.ttl / 60)}`,
      'X-Cache-Key': cacheKey
    });
    
    return res.json(cachedData);
  }

  // Interceptar la respuesta para guardarla en cache
  const originalJson = res.json;
  res.json = function(data) {
    // Solo cachear respuestas exitosas
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(cacheKey, data, config.ttl);
      res.set({
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey
      });
    }
    return originalJson.call(this, data);
  };

  next();
};

// Función para invalidar cache por patrón
const invalidateCache = (pattern) => {
  const keys = cache.keys();
  const regex = new RegExp(pattern);
  
  keys.forEach(key => {
    if (regex.test(key)) {
      cache.del(key);
    }
  });
};

// Función para limpiar cache manualmente
const clearAllCache = () => {
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
  smartCache,
  invalidateCache,
  clearAllCache,
  getCacheStats
};

