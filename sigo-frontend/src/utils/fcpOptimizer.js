/**
 * Optimizador de First Contentful Paint (FCP)
 * 
 * Este módulo optimiza el tiempo de carga inicial
 * para mejorar el FCP de 2.7s a < 1.8s
 */

class FCPOptimizer {
  constructor() {
    this.criticalCSS = '';
    this.preloadedResources = new Set();
  }

  /**
   * Optimizar CSS crítico
   */
  optimizeCriticalCSS() {
    // Inyectar CSS crítico inline
    const criticalCSS = `
      /* CSS crítico para FCP */
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      .loading-screen { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: #fff; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 9999;
      }
      .spinner { 
        width: 40px; 
        height: 40px; 
        border: 4px solid #f3f3f3; 
        border-top: 4px solid #3498db; 
        border-radius: 50%; 
        animation: spin 1s linear infinite; 
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .main-content { opacity: 0; transition: opacity 0.3s; }
      .main-content.loaded { opacity: 1; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
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
      if (!this.preloadedResources.has(resource)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
        this.preloadedResources.add(resource);
      }
    });
  }

  /**
   * Optimizar carga de fuentes
   */
  optimizeFonts() {
    // Preload de fuentes críticas
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
    };
    document.head.appendChild(fontLink);
  }

  /**
   * Implementar loading screen optimizado
   */
  implementLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
      <div class="spinner"></div>
    `;
    document.body.appendChild(loadingScreen);

    // Ocultar loading screen cuando el contenido esté listo
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.remove();
          document.body.classList.add('loaded');
        }, 300);
      }, 500);
    });
  }

  /**
   * Optimizar imágenes críticas
   */
  optimizeCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    
    criticalImages.forEach(img => {
      // Preload de imágenes críticas
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }

  /**
   * Aplicar todas las optimizaciones de FCP
   */
  applyAllOptimizations() {
    console.log('🚀 Aplicando optimizaciones de FCP...');
    
    this.optimizeCriticalCSS();
    this.preloadCriticalResources();
    this.optimizeFonts();
    this.implementLoadingScreen();
    this.optimizeCriticalImages();
    
    console.log('✅ Optimizaciones de FCP aplicadas');
  }
}

// Instancia global
export const fcpOptimizer = new FCPOptimizer();

// Función para inicializar automáticamente
export function initFCPOptimizer() {
  // Aplicar optimizaciones inmediatamente
  fcpOptimizer.applyAllOptimizations();
  
  return fcpOptimizer;
}

// Exportar para uso global
window.fcpOptimizer = fcpOptimizer;
window.initFCPOptimizer = initFCPOptimizer;

export default fcpOptimizer;
