import { useState, useCallback } from 'react';

/**
 * Hook para manejar estados de carga de forma consistente
 * 
 * @param {Object} initialState - Estado inicial
 * @returns {Object} Objeto con funciones y estado de loading
 */
export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);

  /**
   * Establece el estado de carga para una clave específica
   * @param {string} key - Clave del estado de carga
   * @param {boolean} isLoading - Si está cargando
   */
  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  /**
   * Establece múltiples estados de carga a la vez
   * @param {Object} states - Objeto con estados de carga
   */
  const setMultipleLoading = useCallback((states) => {
    setLoadingStates(prev => ({
      ...prev,
      ...states
    }));
  }, []);

  /**
   * Wrapper para funciones async con manejo de loading
   * @param {string} key - Clave del estado de carga
   * @param {Function} asyncFn - Función async a ejecutar
   * @returns {Promise} Resultado de la función
   */
  const withLoading = useCallback(async (key, asyncFn) => {
    try {
      setLoading(key, true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  /**
   * Wrapper para múltiples funciones async con loading
   * @param {Object} operations - Objeto con operaciones { key: asyncFn }
   * @returns {Promise} Resultado de todas las operaciones
   */
  const withMultipleLoading = useCallback(async (operations) => {
    const keys = Object.keys(operations);
    
    try {
      // Establecer todos los estados como loading
      const loadingStates = keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setMultipleLoading(loadingStates);

      // Ejecutar todas las operaciones
      const results = {};
      for (const [key, asyncFn] of Object.entries(operations)) {
        try {
          results[key] = await asyncFn();
        } catch (error) {
          results[key] = { error };
        }
      }

      return results;
    } finally {
      // Establecer todos los estados como no loading
      const notLoadingStates = keys.reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setMultipleLoading(notLoadingStates);
    }
  }, [setMultipleLoading]);

  /**
   * Verifica si alguna operación está cargando
   * @param {string[]} keys - Claves a verificar (opcional)
   * @returns {boolean} Si alguna está cargando
   */
  const isAnyLoading = useCallback((keys = null) => {
    if (keys) {
      return keys.some(key => loadingStates[key]);
    }
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  /**
   * Verifica si todas las operaciones están cargando
   * @param {string[]} keys - Claves a verificar
   * @returns {boolean} Si todas están cargando
   */
  const isAllLoading = useCallback((keys) => {
    return keys.every(key => loadingStates[key]);
  }, [loadingStates]);

  /**
   * Limpia todos los estados de carga
   */
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    loadingStates,
    setLoading,
    setMultipleLoading,
    withLoading,
    withMultipleLoading,
    isAnyLoading,
    isAllLoading,
    clearAllLoading
  };
};

/**
 * Hook simplificado para un solo estado de carga
 * @param {boolean} initialLoading - Estado inicial
 * @returns {Object} Objeto con estado y funciones de loading
 */
export const useSimpleLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const withLoading = useCallback(async (asyncFn) => {
    try {
      setIsLoading(true);
      return await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    withLoading
  };
};

export default useLoadingState;
