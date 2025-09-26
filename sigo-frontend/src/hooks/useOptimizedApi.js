import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '../utils/performance';

/**
 * Hook para optimizar llamadas a la API
 * 
 * Características:
 * - Cache de respuestas
 * - Debounce para búsquedas
 * - Retry automático
 * - Loading states optimizados
 */
export function useOptimizedAPI(apiFunction, options = {}) {
  const {
    debounceMs = 300,
    cacheTime = 5 * 60 * 1000, // 5 minutos
    retryAttempts = 3,
    retryDelay = 1000,
    enabled = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);
  
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Función de API con debounce
  const debouncedApiCall = useDebounce(async (...args) => {
    if (!enabled) return;

    const cacheKey = JSON.stringify(args);
    const now = Date.now();
    
    // Verificar cache
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (now - cached.timestamp < cacheTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    // Cancelar llamada anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    let attempt = 0;
    const makeRequest = async () => {
      try {
        const result = await apiFunction(...args, {
          signal: abortControllerRef.current.signal
        });
        
        // Guardar en cache
        cacheRef.current.set(cacheKey, {
          data: result,
          timestamp: now
        });
        
        setData(result);
        setLastFetch(now);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        
        if (attempt < retryAttempts) {
          attempt++;
          retryTimeoutRef.current = setTimeout(makeRequest, retryDelay * attempt);
          return;
        }
        
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    makeRequest();
  }, debounceMs);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Función para invalidar cache específico
  const invalidateCache = useCallback((pattern) => {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const [key] of cacheRef.current) {
        if (regex.test(key)) {
          cacheRef.current.delete(key);
        }
      }
    } else {
      cacheRef.current.clear();
    }
  }, []);

  // Función para refetch manual
  const refetch = useCallback((...args) => {
    const cacheKey = JSON.stringify(args);
    cacheRef.current.delete(cacheKey);
    debouncedApiCall(...args);
  }, [debouncedApiCall]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    invalidateCache,
    lastFetch,
    // Función para hacer llamadas
    call: debouncedApiCall
  };
}

/**
 * Hook específico para listas con paginación
 */
export function useOptimizedList(apiFunction, options = {}) {
  const {
    pageSize = 20,
    initialPage = 1,
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, refetch, ...api } = useOptimizedAPI(
    useCallback(async (pageNum, searchQuery = '', signal) => {
      const result = await apiFunction({
        page: pageNum,
        limit: pageSize,
        search: searchQuery
      }, { signal });
      
      setTotalPages(Math.ceil(result.total / pageSize));
      setTotalItems(result.total);
      
      return result;
    }, [apiFunction, pageSize]),
    apiOptions
  );

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
    refetch(newPage);
  }, [refetch]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  return {
    ...api,
    data: data?.items || [],
    page,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

/**
 * Hook para búsquedas optimizadas
 */
export function useOptimizedSearch(apiFunction, options = {}) {
  const {
    minLength = 2,
    debounceMs = 300,
    ...apiOptions
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const { data, loading, error } = useOptimizedAPI(
    useCallback(async (searchQuery, signal) => {
      if (searchQuery.length < minLength) {
        return [];
      }
      return await apiFunction(searchQuery, { signal });
    }, [apiFunction, minLength]),
    {
      ...apiOptions,
      debounceMs
    }
  );

  useEffect(() => {
    if (data) {
      setResults(data);
    }
  }, [data]);

  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.length >= minLength) {
      // La llamada se hace automáticamente por el debounce
    } else {
      setResults([]);
    }
  }, [minLength]);

  return {
    query,
    results,
    loading,
    error,
    search,
    hasResults: results.length > 0,
    isSearching: loading && query.length >= minLength
  };
}