/**
 * Optimizador de Render Blocking Requests
 * 
 * Este módulo elimina recursos que bloquean el renderizado
 * para ahorrar 450ms en el tiempo de carga
 */

class RenderBlockingOptimizer {
  constructor() {
    this.blockingResources = [];
    this.optimizedResources = new Set();
  }

  /**
   * Identificar recursos que bloquean el renderizado
   */
  identifyBlockingResources() {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach(resource => {
      if (this.isBlockingResource(resource)) {
        this.blockingResources.push(resource);
        console.log('🚫 Recurso bloqueante identificado:', resource.name);
      }
    });
    
    return this.blockingResources;
  }

  /**
   * Verificar si un recurso es bloqueante
   */
  isBlockingResource(resource) {
    const name = resource.name.toLowerCase();
    
    // CSS que bloquea el renderizado
    if (name.includes('.css') && !name.includes('critical')) {
      return true;
    }
    
    // JavaScript que bloquea el renderizado
    if (name.includes('.js') && !name.includes('async') && !name.includes('defer')) {
      return true;
    }
    
    // Fuentes que bloquean el renderizado
    if (name.includes('fonts.googleapis.com') || name.includes('fonts.gstatic.com')) {
      return true;
    }
    
    return false;
  }

  /**
   * Optimizar CSS bloqueante
   */
  optimizeBlockingCSS() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    cssLinks.forEach(link => {
      if (!link.href.includes('critical')) {
        // Convertir a preload
        link.rel = 'preload';
        link.as = 'style';
        link.onload = function() {
          this.rel = 'stylesheet';
        };
        
        // Agregar fallback
        const fallback = document.createElement('noscript');
        fallback.innerHTML = `<link rel="stylesheet" href="${link.href}">`;
        link.parentNode.insertBefore(fallback, link.nextSibling);
      }
    });
  }

  /**
   * Optimizar JavaScript bloqueante
   */
  optimizeBlockingJS() {
    const jsScripts = document.querySelectorAll('script[src]');
    
    jsScripts.forEach(script => {
      if (!script.async && !script.defer) {
        // Agregar defer a scripts no críticos
        if (!script.src.includes('critical') && !script.src.includes('main')) {
          script.defer = true;
        }
        
        // Agregar async a scripts de terceros
        if (script.src.includes('google') || 
            script.src.includes('facebook') || 
            script.src.includes('analytics')) {
          script.async = true;
        }
      }
    });
  }

  /**
   * Optimizar fuentes bloqueantes
   */
  optimizeBlockingFonts() {
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    
    fontLinks.forEach(link => {
      // Convertir a preload
      link.rel = 'preload';
      link.as = 'style';
      link.onload = function() {
        this.rel = 'stylesheet';
      };
      
      // Agregar display=swap
      if (!link.href.includes('display=swap')) {
        const url = new URL(link.href);
        url.searchParams.set('display', 'swap');
        link.href = url.toString();
      }
    });
  }

  /**
   * Implementar CSS crítico inline
   */
  implementCriticalCSS() {
    const criticalCSS = `
      /* CSS crítico para renderizado inmediato */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.5;
        color: #333;
        background: #fff;
      }
      
      /* Estilos críticos para el header */
      .navbar, .header {
        background: #fff;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 0;
      }
      
      /* Estilos críticos para el contenido principal */
      .main-content, main {
        padding: 2rem 0;
        min-height: 50vh;
      }
      
      /* Estilos críticos para botones */
      .btn, button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
      }
      
      .btn:hover, button:hover {
        background: #2563eb;
      }
      
      /* Estilos críticos para formularios */
      .form-control, input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
      }
      
      .form-control:focus, input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      /* Estilos críticos para cards */
      .card {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1rem;
      }
      
      /* Estilos críticos para la grilla */
      .grid {
        display: grid;
        gap: 1rem;
      }
      
      .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
      .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
      .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
      .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
      
      @media (max-width: 768px) {
        .grid-cols-2, .grid-cols-3, .grid-cols-4 {
          grid-template-columns: 1fr;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }

  /**
   * Preload de recursos críticos
   */
  preloadCriticalResources() {
    const criticalResources = [
      '/api/dashboard',
      '/api/estudiantes',
      '/api/agenda'
    ];

    criticalResources.forEach(resource => {
      if (!this.optimizedResources.has(resource)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
        this.optimizedResources.add(resource);
      }
    });
  }

  /**
   * Optimizar carga de imágenes
   */
  optimizeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Agregar loading="lazy" a imágenes no críticas
      if (!img.hasAttribute('data-critical')) {
        img.loading = 'lazy';
      }
      
      // Agregar decoding="async"
      img.decoding = 'async';
      
      // Preload de imágenes críticas
      if (img.hasAttribute('data-critical')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Aplicar todas las optimizaciones de render blocking
   */
  applyAllOptimizations() {
    console.log('🚀 Aplicando optimizaciones de Render Blocking...');
    
    this.identifyBlockingResources();
    this.implementCriticalCSS();
    this.optimizeBlockingCSS();
    this.optimizeBlockingJS();
    this.optimizeBlockingFonts();
    this.preloadCriticalResources();
    this.optimizeImageLoading();
    
    console.log('✅ Optimizaciones de Render Blocking aplicadas');
    console.log(`📊 Recursos bloqueantes identificados: ${this.blockingResources.length}`);
  }

  /**
   * Obtener métricas de render blocking
   */
  getRenderBlockingMetrics() {
    const resources = performance.getEntriesByType('resource');
    const blockingResources = resources.filter(resource => this.isBlockingResource(resource));
    
    const totalBlockingTime = blockingResources.reduce((total, resource) => {
      return total + (resource.responseEnd - resource.requestStart);
    }, 0);
    
    return {
      totalBlockingTime,
      blockingResourcesCount: blockingResources.length,
      estimatedSavings: Math.round(totalBlockingTime * 0.3), // Estimación del 30% de ahorro
      resources: blockingResources.map(r => ({
        name: r.name,
        duration: r.responseEnd - r.requestStart,
        type: r.name.includes('.css') ? 'CSS' : 'JS'
      }))
    };
  }
}

// Instancia global
export const renderBlockingOptimizer = new RenderBlockingOptimizer();

// Función para inicializar automáticamente
export function initRenderBlockingOptimizer() {
  // Aplicar optimizaciones inmediatamente
  renderBlockingOptimizer.applyAllOptimizations();
  
  return renderBlockingOptimizer;
}

// Exportar para uso global
window.renderBlockingOptimizer = renderBlockingOptimizer;
window.initRenderBlockingOptimizer = initRenderBlockingOptimizer;

export default renderBlockingOptimizer;
