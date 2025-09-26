/**
 * Utilidades de Rendimiento para SIGO
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Hook para debounce de funciones
 */
export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
}

/**
 * Hook para throttling de funciones
 */
export function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
}

/**
 * Hook para optimizar búsquedas
 */
export function useSearchOptimization(searchFn, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearch = useDebounce(async (searchQuery) => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const searchResults = await searchFn(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  }, delay);
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return {
    query,
    setQuery,
    results,
    isSearching
  };
}

/**
 * Función para medir tiempo de renderizado
 */
export function measureRenderTime(componentName, renderFn) {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  console.log(`${componentName} renderizado en ${(end - start).toFixed(2)}ms`);
  
  return result;
}