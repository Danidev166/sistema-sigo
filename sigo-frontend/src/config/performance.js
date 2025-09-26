/**
 * Configuración de Rendimiento para SIGO
 * 
 * Este archivo contiene configuraciones optimizadas
 * para mejorar el rendimiento de la aplicación.
 */

export const PERFORMANCE_CONFIG = {
  // Configuración de debounce
  DEBOUNCE: {
    SEARCH: 300,
    SCROLL: 100,
    RESIZE: 150,
    API_CALLS: 500
  },
  
  // Configuración de cache
  CACHE: {
    API_RESPONSES: 5 * 60 * 1000, // 5 minutos
    IMAGES: 30 * 60 * 1000, // 30 minutos
    COMPONENTS: 10 * 60 * 1000, // 10 minutos
    LOCAL_STORAGE: 24 * 60 * 60 * 1000 // 24 horas
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    VIRTUALIZATION_THRESHOLD: 1000
  },
  
  // Configuración de imágenes
  IMAGES: {
    LAZY_LOADING_THRESHOLD: 100, // px
    PLACEHOLDER_QUALITY: 20,
    WEBP_QUALITY: 80,
    JPEG_QUALITY: 85
  },
  
  // Configuración de API
  API: {
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    BATCH_SIZE: 50
  },
  
  // Configuración de Web Vitals
  WEB_VITALS: {
    FCP_THRESHOLD: 1800, // ms
    LCP_THRESHOLD: 2500, // ms
    FID_THRESHOLD: 100, // ms
    CLS_THRESHOLD: 0.1
  },
  
  // Configuración de bundle
  BUNDLE: {
    MAX_CHUNK_SIZE: 500 * 1024, // 500KB
    MAX_TOTAL_SIZE: 2 * 1024 * 1024, // 2MB
    COMPRESSION_LEVEL: 6
  }
};

// Configuración de lazy loading
export const LAZY_LOADING_CONFIG = {
  // Componentes que se cargan bajo demanda
  LAZY_COMPONENTS: [
    'ReportesPage',
    'EstudiantesPage',
    'AgendaPage',
    'EvaluacionesPage',
    'RecursosPage',
    'ConfiguracionPage'
  ],
  
  // Rutas que se precargan
  PRELOAD_ROUTES: [
    '/dashboard',
    '/estudiantes',
    '/agenda'
  ],
  
  // Recursos críticos que se precargan
  PRELOAD_RESOURCES: [
    '/api/estudiantes',
    '/api/dashboard',
    '/api/agenda'
  ]
};

// Configuración de optimización de imágenes
export const IMAGE_OPTIMIZATION = {
  // Formatos soportados
  SUPPORTED_FORMATS: ['webp', 'avif', 'jpeg', 'png'],
  
  // Tamaños de imagen
  SIZES: {
    THUMBNAIL: { width: 150, height: 150 },
    MEDIUM: { width: 400, height: 300 },
    LARGE: { width: 800, height: 600 }
  },
  
  // Configuración de lazy loading
  LAZY_LOADING: {
    ROOT_MARGIN: '50px',
    THRESHOLD: 0.1
  }
};

// Configuración de Service Worker
export const SERVICE_WORKER_CONFIG = {
  CACHE_NAME: 'sigo-cache-v1',
  CACHE_STRATEGIES: {
    API: 'network-first',
    IMAGES: 'cache-first',
    STATIC: 'cache-first'
  },
  CACHE_PATTERNS: [
    /^https:\/\/sigo-frontend-2025\.onrender\.com\/api\//,
    /^https:\/\/sigo-frontend-2025\.onrender\.com\/assets\//,
    /\.(js|css|png|jpg|jpeg|gif|svg|webp)$/
  ]
};

// Configuración de monitoreo
export const MONITORING_CONFIG = {
  // Métricas que se monitorean
  METRICS: [
    'fcp', // First Contentful Paint
    'lcp', // Largest Contentful Paint
    'fid', // First Input Delay
    'cls', // Cumulative Layout Shift
    'ttfb', // Time to First Byte
    'render_time', // Tiempo de renderizado
    'api_response_time' // Tiempo de respuesta de API
  ],
  
  // Umbrales de alerta
  ALERTS: {
    SLOW_RENDER: 100, // ms
    SLOW_API: 1000, // ms
    HIGH_MEMORY: 50 * 1024 * 1024, // 50MB
    HIGH_CPU: 80 // %
  },
  
  // Intervalo de monitoreo
  MONITORING_INTERVAL: 5000 // ms
};

// Función para obtener configuración optimizada según el entorno
export function getOptimizedConfig(environment = 'production') {
  const baseConfig = { ...PERFORMANCE_CONFIG };
  
  if (environment === 'development') {
    // Configuraciones más permisivas para desarrollo
    baseConfig.CACHE.API_RESPONSES = 30 * 1000; // 30 segundos
    baseConfig.API.TIMEOUT = 30000; // 30 segundos
    baseConfig.DEBOUNCE.SEARCH = 100; // Más rápido para desarrollo
  }
  
  if (environment === 'test') {
    // Configuraciones para testing
    baseConfig.CACHE.API_RESPONSES = 0; // Sin cache
    baseConfig.API.TIMEOUT = 5000; // 5 segundos
    baseConfig.DEBOUNCE.SEARCH = 0; // Sin debounce
  }
  
  return baseConfig;
}

// Función para validar configuración de rendimiento
export function validatePerformanceConfig(config) {
  const errors = [];
  
  if (config.DEBOUNCE.SEARCH < 0) {
    errors.push('DEBOUNCE.SEARCH debe ser mayor o igual a 0');
  }
  
  if (config.CACHE.API_RESPONSES < 0) {
    errors.push('CACHE.API_RESPONSES debe ser mayor o igual a 0');
  }
  
  if (config.PAGINATION.DEFAULT_PAGE_SIZE < 1) {
    errors.push('PAGINATION.DEFAULT_PAGE_SIZE debe ser mayor a 0');
  }
  
  if (config.API.TIMEOUT < 1000) {
    errors.push('API.TIMEOUT debe ser mayor a 1000ms');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default PERFORMANCE_CONFIG;
