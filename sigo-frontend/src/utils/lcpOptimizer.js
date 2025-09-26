/**
 * Optimizador de Largest Contentful Paint (LCP)
 * 
 * Este módulo optimiza el elemento más grande de la página
 * para mejorar el LCP de 3.8s a < 2.5s
 */

class LCPOptimizer {
  constructor() {
    this.lcpElement = null;
    this.observers = new Map();
  }

  /**
   * Identificar y optimizar el elemento LCP
   */
  identifyLCPElement() {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry.element) {
        this.lcpElement = lastEntry.element;
        console.log('🎯 Elemento LCP identificado:', lastEntry.element);
        this.optimizeLCPElement(lastEntry.element);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  /**
   * Optimizar el elemento LCP específico
   */
  optimizeLCPElement(element) {
    if (!element) return;

    // Si es una imagen
    if (element.tagName === 'IMG') {
      this.optimizeImageLCP(element);
    }
    
    // Si es un contenedor de texto
    if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
      this.optimizeTextLCP(element);
    }

    // Si es un video
    if (element.tagName === 'VIDEO') {
      this.optimizeVideoLCP(element);
    }
  }

  /**
   * Optimizar imagen LCP
   */
  optimizeImageLCP(img) {
    // Asegurar que la imagen tenga dimensiones
    if (!img.width || !img.height) {
      img.style.aspectRatio = '16/9';
      img.style.objectFit = 'cover';
    }

    // Preload de la imagen
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);

    // Optimizar carga
    img.loading = 'eager';
    img.decoding = 'async';
    img.fetchPriority = 'high';
  }

  /**
   * Optimizar texto LCP
   */
  optimizeTextLCP(element) {
    // Asegurar que el texto esté visible inmediatamente
    element.style.contain = 'layout';
    element.style.willChange = 'auto';
    
    // Preload de fuentes críticas
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    
    if (fontFamily && !fontFamily.includes('system-ui')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`;
      link.as = 'style';
      document.head.appendChild(link);
    }
  }

  /**
   * Optimizar video LCP
   */
  optimizeVideoLCP(video) {
    video.preload = 'metadata';
    video.loading = 'eager';
    video.fetchPriority = 'high';
  }

  /**
   * Optimizar recursos críticos para LCP
   */
  optimizeCriticalResources() {
    // Preload de API críticas
    const criticalAPIs = [
      '/api/dashboard',
      '/api/estudiantes',
      '/api/agenda'
    ];

    criticalAPIs.forEach(api => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = api;
      document.head.appendChild(link);
    });

    // Preload de CSS crítico
    const criticalCSS = document.querySelector('link[rel="stylesheet"]');
    if (criticalCSS) {
      criticalCSS.rel = 'preload';
      criticalCSS.as = 'style';
      criticalCSS.onload = function() {
        this.rel = 'stylesheet';
      };
    }
  }

  /**
   * Optimizar renderizado del contenido principal
   */
  optimizeMainContent() {
    const mainContent = document.querySelector('main, .main-content, #root');
    if (mainContent) {
      // Asegurar que el contenido principal sea visible
      mainContent.style.contain = 'layout';
      mainContent.style.willChange = 'auto';
      
      // Preload de contenido crítico
      const criticalElements = mainContent.querySelectorAll('[data-critical]');
      criticalElements.forEach(el => {
        el.style.contain = 'layout';
        el.style.willChange = 'auto';
      });
    }
  }

  /**
   * Aplicar todas las optimizaciones de LCP
   */
  applyAllOptimizations() {
    console.log('🚀 Aplicando optimizaciones de LCP...');
    
    this.identifyLCPElement();
    this.optimizeCriticalResources();
    this.optimizeMainContent();
    
    console.log('✅ Optimizaciones de LCP aplicadas');
  }

  /**
   * Obtener métricas de LCP
   */
  getLCPMetrics() {
    return new Promise((resolve) => {
      if (!window.PerformanceObserver) {
        resolve(null);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        resolve({
          value: lastEntry.startTime,
          element: lastEntry.element,
          url: lastEntry.url,
          size: lastEntry.size
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Resolver después de 5 segundos
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 5000);
    });
  }

  /**
   * Limpiar observadores
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Instancia global
export const lcpOptimizer = new LCPOptimizer();

// Función para inicializar automáticamente
export function initLCPOptimizer() {
  // Aplicar optimizaciones inmediatamente
  lcpOptimizer.applyAllOptimizations();
  
  return lcpOptimizer;
}

// Exportar para uso global
window.lcpOptimizer = lcpOptimizer;
window.initLCPOptimizer = initLCPOptimizer;

export default lcpOptimizer;
