import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Hook personalizado para manejo consistente de errores
 * 
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.showToast - Si mostrar toast de error (default: true)
 * @param {string} options.defaultMessage - Mensaje por defecto para errores
 * @param {Function} options.onError - Callback personalizado para errores
 * @returns {Object} Objeto con funciones de manejo de errores
 */
export const useErrorHandler = (options = {}) => {
  const {
    showToast = true,
    defaultMessage = 'Ha ocurrido un error inesperado',
    onError = null
  } = options;

  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  /**
   * Maneja errores de forma consistente
   * @param {Error|Object} error - Error a manejar
   * @param {string} context - Contexto donde ocurrió el error
   * @param {Object} additionalData - Datos adicionales para logging
   */
  const handleError = useCallback((error, context = 'Unknown', additionalData = {}) => {
    console.error(`❌ Error en ${context}:`, error, additionalData);
    
    // Determinar mensaje de error
    let errorMessage = defaultMessage;
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Mostrar toast si está habilitado
    if (showToast) {
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        position: 'top-right'
      });
    }

    // Actualizar estado
    setError({
      message: errorMessage,
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
      additionalData
    });
    setIsError(true);

    // Callback personalizado
    if (onError) {
      onError(error, context, additionalData);
    }
  }, [showToast, defaultMessage, onError]);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * Wrapper para funciones async con manejo de errores
   * @param {Function} asyncFn - Función async a ejecutar
   * @param {string} context - Contexto para el error
   * @returns {Promise} Resultado de la función o null si hay error
   */
  const withErrorHandling = useCallback(async (asyncFn, context = 'Async operation') => {
    try {
      clearError();
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError, clearError]);

  /**
   * Wrapper para funciones síncronas con manejo de errores
   * @param {Function} syncFn - Función síncrona a ejecutar
   * @param {string} context - Contexto para el error
   * @returns {any} Resultado de la función o null si hay error
   */
  const withSyncErrorHandling = useCallback((syncFn, context = 'Sync operation') => {
    try {
      clearError();
      return syncFn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError, clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    withErrorHandling,
    withSyncErrorHandling
  };
};

/**
 * Hook para manejo de errores de API específicamente
 */
export const useApiErrorHandler = () => {
  return useErrorHandler({
    defaultMessage: 'Error de conexión con el servidor',
    onError: (error, context) => {
      // Logging adicional para errores de API
      if (error?.response?.status) {
        console.error(`API Error ${error.response.status}:`, error.response.data);
      }
    }
  });
};

/**
 * Hook para manejo de errores de validación
 */
export const useValidationErrorHandler = () => {
  return useErrorHandler({
    defaultMessage: 'Error de validación',
    showToast: true
  });
};

export default useErrorHandler;
