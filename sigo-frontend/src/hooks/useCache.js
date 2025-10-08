import { useState, useEffect } from 'react';

const CACHE_PREFIX = 'sigo_cache_';
const DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutos

export const useCache = (key, fetchData, expiryTime = DEFAULT_EXPIRY) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFromCache = async () => {
      try {
        // 🚀 OPTIMIZACIÓN: Verificar caché de forma más eficiente
        const cacheKey = CACHE_PREFIX + key;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          try {
            const { data: cachedValue, timestamp } = JSON.parse(cachedData);
            const isExpired = Date.now() - timestamp > expiryTime;

            if (!isExpired) {
              console.log(`📦 Cache hit para ${key}`);
              setData(cachedValue);
              setLoading(false);
              return;
            } else {
              console.log(`⏰ Cache expirado para ${key}, limpiando...`);
              localStorage.removeItem(cacheKey);
            }
          } catch (parseError) {
            console.warn(`⚠️ Error parseando cache para ${key}:`, parseError);
            localStorage.removeItem(cacheKey);
          }
        }

        console.log(`🔄 Cache miss para ${key}, obteniendo datos frescos...`);
        
        // Si no hay caché o está expirado, hacer la petición
        const freshData = await fetchData();
        
        // 🚀 OPTIMIZACIÓN: Solo guardar en caché si los datos son válidos
        if (freshData !== null && freshData !== undefined) {
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                data: freshData,
                timestamp: Date.now()
              })
            );
            console.log(`💾 Datos guardados en cache para ${key}`);
          } catch (storageError) {
            console.warn(`⚠️ Error guardando en cache para ${key}:`, storageError);
            // Si no se puede guardar en localStorage, continuar sin caché
          }
        }

        setData(freshData);
        setLoading(false);
      } catch (err) {
        console.error(`❌ Error en useCache para ${key}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    fetchFromCache();
  }, [key, fetchData, expiryTime]);

  const invalidateCache = () => {
    const cacheKey = CACHE_PREFIX + key;
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache invalidado para ${key}`);
  };

  return { data, loading, error, invalidateCache };
};

// Función de utilidad para limpiar todo el caché
export const clearAllCache = () => {
  const keysToRemove = Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX));
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log(`🗑️ Cache limpiado: ${keysToRemove.length} elementos eliminados`);
  return keysToRemove.length;
};

// 🚀 NUEVA FUNCIÓN: Limpiar cache expirado automáticamente
export const cleanExpiredCache = () => {
  const now = Date.now();
  let cleanedCount = 0;
  
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => {
      try {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          const { timestamp } = JSON.parse(cachedData);
          const isExpired = now - timestamp > DEFAULT_EXPIRY;
          
          if (isExpired) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      } catch (error) {
        // Si hay error parseando, eliminar el cache corrupto
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cache expirado limpiado: ${cleanedCount} elementos eliminados`);
  }
  
  return cleanedCount;
};

// 🚀 NUEVA FUNCIÓN: Obtener estadísticas del cache
export const getCacheStats = () => {
  const cacheKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX));
  
  const stats = {
    totalKeys: cacheKeys.length,
    totalSize: 0,
    expiredKeys: 0,
    validKeys: 0
  };
  
  const now = Date.now();
  
  cacheKeys.forEach(key => {
    try {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        stats.totalSize += cachedData.length;
        
        const { timestamp } = JSON.parse(cachedData);
        const isExpired = now - timestamp > DEFAULT_EXPIRY;
        
        if (isExpired) {
          stats.expiredKeys++;
        } else {
          stats.validKeys++;
        }
      }
    } catch (error) {
      stats.expiredKeys++;
    }
  });
  
  return stats;
};

// 🚀 NUEVA FUNCIÓN: Limpieza automática periódica
let cleanupInterval = null;

export const startAutoCleanup = (intervalMinutes = 10) => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  
  cleanupInterval = setInterval(() => {
    cleanExpiredCache();
  }, intervalMinutes * 60 * 1000);
  
  console.log(`🔄 Auto-limpieza de cache iniciada cada ${intervalMinutes} minutos`);
};

export const stopAutoCleanup = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('⏹️ Auto-limpieza de cache detenida');
  }
}; 