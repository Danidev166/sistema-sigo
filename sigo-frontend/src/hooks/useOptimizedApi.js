import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook optimizado para llamadas API con cache inteligente
 * 
 * @param {string} key - Clave única para el cache
 * @param {Function} fetchFn - Función que retorna la promesa de la API
 * @param {Object} options - Opciones de configuración
 * @param {number} options.ttl - Tiempo de vida del cache en ms (default: 5 minutos)
 * @param {boolean} options.enabled - Si la llamada debe ejecutarse (default: true)
 * @param {number} options.debounceMs - Tiempo de debounce en ms (default: 0)
 * @returns {Object} { data, loading, error, refetch, invalidateCache }
 */
export const useOptimizedApi = (key, fetchFn, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutos
    enabled = true,
    debounceMs = 0
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const CACHE_PREFIX = 'sigo_api_cache_';

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return cachedData;
        }
      }
    } catch (err) {
      console.warn('Error reading cache:', err);
    }
    return null;
  }, [key, ttl]);

  const setCachedData = useCallback((newData) => {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        data: newData,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Error setting cache:', err);
    }
  }, [key]);

  const invalidateCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (err) {
      console.warn('Error invalidating cache:', err);
    }
  }, [key]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Cancelar llamada anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    // Verificar cache si no es force refresh
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(abortControllerRef.current.signal);
      setData(result);
      setCachedData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        console.error('API Error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, fetchFn, getCachedData, setCachedData]);

  const debouncedFetch = useCallback((forceRefresh = false) => {
    if (debounceMs > 0) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchData(forceRefresh);
      }, debounceMs);
    } else {
      fetchData(forceRefresh);
    }
  }, [fetchData, debounceMs]);

  const refetch = useCallback(() => {
    debouncedFetch(true);
  }, [debouncedFetch]);

  useEffect(() => {
    if (enabled) {
      debouncedFetch();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [enabled, debouncedFetch]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  };
};

/**
 * Hook para debounce de valores
 * 
 * @param {any} value - Valor a debouncear
 * @param {number} delay - Delay en ms
 * @returns {any} Valor debounceado
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para memoización de funciones costosas
 * 
 * @param {Function} fn - Función a memoizar
 * @param {Array} deps - Dependencias
 * @returns {Function} Función memoizada
 */
export const useMemoizedCallback = (fn, deps) => {
  return useCallback(fn, deps);
}; 