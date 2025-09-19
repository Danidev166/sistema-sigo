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
        const cachedData = localStorage.getItem(CACHE_PREFIX + key);
        
        if (cachedData) {
          const { data: cachedValue, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > expiryTime;

          if (!isExpired) {
            setData(cachedValue);
            setLoading(false);
            return;
          }
        }

        // Si no hay caché o está expirado, hacer la petición
        const freshData = await fetchData();
        
        // Guardar en caché
        localStorage.setItem(
          CACHE_PREFIX + key,
          JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          })
        );

        setData(freshData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFromCache();
  }, [key, fetchData, expiryTime]);

  const invalidateCache = () => {
    localStorage.removeItem(CACHE_PREFIX + key);
  };

  return { data, loading, error, invalidateCache };
};

// Función de utilidad para limpiar todo el caché
export const clearAllCache = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}; 