/**
 * Monitor de Rendimiento en Tiempo Real
 * 
 * Este módulo proporciona herramientas para monitorear
 * y optimizar el rendimiento de la aplicación.
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Medir tiempo de ejecución de una función
   */
  measure(name, fn) {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const duration = end - start;
    this.metrics.set(name, duration);
    
    if (duration > 100) {
      console.warn(`⚠️ ${name} tardó ${duration.toFixed(2)}ms`);
    } else {
      console.log(`✅ ${name} completado en ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  /**
   * Medir tiempo de renderizado de un componente
   */
  measureRender(componentName, renderFn) {
    return this.measure(`Render: ${componentName}`, renderFn);
  }

  /**
   * Medir tiempo de API calls
   */
  measureAPI(endpoint, apiCall) {
    return this.measure(`API: ${endpoint}`, apiCall);
  }

  /**
   * Observar cambios en el DOM
   */
  observeDOM(element, callback) {
    if (!this.isEnabled || !window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      const duration = performance.now() - this.metrics.get('dom-start') || 0;
      callback(mutations, duration);
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true
    });

    this.observers.set(element, observer);
  }

  /**
   * Medir tiempo de carga de imágenes
   */
  measureImageLoad(src) {
    if (!this.isEnabled) return Promise.resolve();

    return new Promise((resolve) => {
      const start = performance.now();
      const img = new Image();
      
      img.onload = () => {
        const duration = performance.now() - start;
        this.metrics.set(`Image: ${src}`, duration);
        console.log(`🖼️ Imagen ${src} cargada en ${duration.toFixed(2)}ms`);
        resolve(duration);
      };
      
      img.onerror = () => {
        console.error(`❌ Error cargando imagen: ${src}`);
        resolve(0);
      };
      
      img.src = src;
    });
  }

  /**
   * Medir tiempo de scroll
   */
  measureScroll(element) {
    if (!this.isEnabled) return;

    let scrollStart = 0;
    let isScrolling = false;

    element.addEventListener('scroll', () => {
      if (!isScrolling) {
        scrollStart = performance.now();
        isScrolling = true;
      }
    });

    element.addEventListener('scrollend', () => {
      if (isScrolling) {
        const duration = performance.now() - scrollStart;
        this.metrics.set('scroll-duration', duration);
        console.log(`📜 Scroll completado en ${duration.toFixed(2)}ms`);
        isScrolling = false;
      }
    });
  }

  /**
   * Obtener métricas de rendimiento
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Obtener métricas de Web Vitals
   */
  getWebVitals() {
    return new Promise((resolve) => {
      if (!this.isEnabled || !window.PerformanceObserver) {
        resolve({});
        return;
      }

      const vitals = {};

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitals.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        vitals.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Resolver después de un tiempo para recopilar métricas
      setTimeout(() => {
        resolve(vitals);
      }, 5000);
    });
  }

  /**
   * Generar reporte de rendimiento
   */
  async generateReport() {
    const metrics = this.getMetrics();
    const vitals = await this.getWebVitals();
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      vitals,
      recommendations: this.generateRecommendations(metrics, vitals)
    };

    console.log('📊 Reporte de Rendimiento:', report);
    return report;
  }

  /**
   * Generar recomendaciones basadas en métricas
   */
  generateRecommendations(metrics, vitals) {
    const recommendations = [];

    // Verificar métricas de renderizado
    Object.entries(metrics).forEach(([name, duration]) => {
      if (name.startsWith('Render:') && duration > 100) {
        recommendations.push({
          type: 'render',
          component: name.replace('Render: ', ''),
          issue: 'Render lento',
          suggestion: 'Considera usar React.memo() o useMemo()'
        });
      }
    });

    // Verificar Web Vitals
    if (vitals.fcp > 1800) {
      recommendations.push({
        type: 'fcp',
        issue: 'First Contentful Paint lento',
        suggestion: 'Optimiza el CSS crítico y reduce el JavaScript inicial'
      });
    }

    if (vitals.lcp > 2500) {
      recommendations.push({
        type: 'lcp',
        issue: 'Largest Contentful Paint lento',
        suggestion: 'Optimiza imágenes y recursos críticos'
      });
    }

    if (vitals.fid > 100) {
      recommendations.push({
        type: 'fid',
        issue: 'First Input Delay alto',
        suggestion: 'Reduce el JavaScript de larga duración'
      });
    }

    if (vitals.cls > 0.1) {
      recommendations.push({
        type: 'cls',
        issue: 'Cumulative Layout Shift alto',
        suggestion: 'Reserva espacio para imágenes y evita cambios de layout'
      });
    }

    return recommendations;
  }

  /**
   * Limpiar observadores
   */
  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics.clear();
  }
}

// Instancia global
export const performanceMonitor = new PerformanceMonitor();

// Hook para usar en componentes
export function usePerformanceMonitor(componentName) {
  const measureRender = (renderFn) => {
    return performanceMonitor.measureRender(componentName, renderFn);
  };

  const measureAPI = (endpoint, apiCall) => {
    return performanceMonitor.measureAPI(endpoint, apiCall);
  };

  return { measureRender, measureAPI };
}

export default performanceMonitor;
