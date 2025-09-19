/**
 * Utilidades para monitoreo y optimización de rendimiento
 */

// Métricas de rendimiento
let performanceMetrics = {
  pageLoads: {},
  apiCalls: {},
  renderTimes: {}
};

/**
 * Medir tiempo de carga de página
 * 
 * @param {string} pageName - Nombre de la página
 * @returns {Function} Función para finalizar la medición
 */
export const measurePageLoad = (pageName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (!performanceMetrics.pageLoads[pageName]) {
      performanceMetrics.pageLoads[pageName] = [];
    }
    
    performanceMetrics.pageLoads[pageName].push(loadTime);
    
    // Log si es muy lento
    if (loadTime > 3000) {
      console.warn(`⚠️ Página ${pageName} tardó ${loadTime.toFixed(2)}ms en cargar`);
    }
    
    return loadTime;
  };
};

/**
 * Medir tiempo de llamada API
 * 
 * @param {string} endpoint - Endpoint de la API
 * @returns {Function} Función para finalizar la medición
 */
export const measureApiCall = (endpoint) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const callTime = endTime - startTime;
    
    if (!performanceMetrics.apiCalls[endpoint]) {
      performanceMetrics.apiCalls[endpoint] = [];
    }
    
    performanceMetrics.apiCalls[endpoint].push(callTime);
    
    // Log si es muy lento
    if (callTime > 2000) {
      console.warn(`⚠️ API ${endpoint} tardó ${callTime.toFixed(2)}ms en responder`);
    }
    
    return callTime;
  };
};

/**
 * Medir tiempo de renderizado de componente
 * 
 * @param {string} componentName - Nombre del componente
 * @returns {Function} Función para finalizar la medición
 */
export const measureRender = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (!performanceMetrics.renderTimes[componentName]) {
      performanceMetrics.renderTimes[componentName] = [];
    }
    
    performanceMetrics.renderTimes[componentName].push(renderTime);
    
    // Log si es muy lento
    if (renderTime > 100) {
      console.warn(`⚠️ Componente ${componentName} tardó ${renderTime.toFixed(2)}ms en renderizar`);
    }
    
    return renderTime;
  };
};

/**
 * Obtener métricas de rendimiento
 * 
 * @returns {Object} Métricas calculadas
 */
export const getPerformanceMetrics = () => {
  const metrics = {};
  
  // Métricas de páginas
  Object.keys(performanceMetrics.pageLoads).forEach(page => {
    const times = performanceMetrics.pageLoads[page];
    metrics[`page_${page}`] = {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  });
  
  // Métricas de API
  Object.keys(performanceMetrics.apiCalls).forEach(endpoint => {
    const times = performanceMetrics.apiCalls[endpoint];
    metrics[`api_${endpoint}`] = {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  });
  
  // Métricas de renderizado
  Object.keys(performanceMetrics.renderTimes).forEach(component => {
    const times = performanceMetrics.renderTimes[component];
    metrics[`render_${component}`] = {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  });
  
  return metrics;
};

/**
 * Limpiar métricas de rendimiento
 */
export const clearPerformanceMetrics = () => {
  performanceMetrics = {
    pageLoads: {},
    apiCalls: {},
    renderTimes: {}
  };
};

/**
 * Debounce function
 * 
 * @param {Function} func - Función a debouncear
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounceada
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * 
 * @param {Function} func - Función a throttlear
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función throttled
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoización simple
 * 
 * @param {Function} fn - Función a memoizar
 * @returns {Function} Función memoizada
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Verificar si el dispositivo es lento
 * 
 * @returns {boolean} Si el dispositivo es considerado lento
 */
export const isSlowDevice = () => {
  // Verificar conexión lenta
  if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true;
    }
  }
  
  // Verificar memoria disponible
  if ('deviceMemory' in navigator) {
    if (navigator.deviceMemory < 4) {
      return true;
    }
  }
  
  // Verificar CPU cores
  if ('hardwareConcurrency' in navigator) {
    if (navigator.hardwareConcurrency < 4) {
      return true;
    }
  }
  
  return false;
};

/**
 * Optimizar para dispositivos lentos
 */
export const optimizeForSlowDevices = () => {
  if (isSlowDevice()) {
    // Reducir animaciones
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    
    // Deshabilitar efectos visuales pesados
    document.documentElement.classList.add('reduced-motion');
    
    // Reducir calidad de imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src.includes('high-quality')) {
        img.src = img.src.replace('high-quality', 'low-quality');
      }
    });
  }
};

/**
 * Preload recursos críticos
 * 
 * @param {Array} resources - Array de URLs a preloadear
 */
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

/**
 * Lazy load de componentes
 * 
 * @param {Function} importFn - Función de importación
 * @param {number} delay - Delay antes de cargar
 * @returns {Promise} Promesa del componente
 */
export const lazyLoadComponent = (importFn, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      importFn().then(resolve);
    }, delay);
  });
}; 