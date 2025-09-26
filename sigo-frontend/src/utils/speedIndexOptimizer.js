/**
 * Optimizador de Speed Index
 * 
 * Este módulo optimiza la velocidad de renderizado
 * para mejorar el Speed Index de 4.6s a < 3.4s
 */

class SpeedIndexOptimizer {
  constructor() {
    this.renderQueue = [];
    this.isRendering = false;
  }

  /**
   * Optimizar renderizado progresivo
   */
  implementProgressiveRendering() {
    // Dividir el contenido en chunks para renderizado progresivo
    const contentChunks = this.divideContentIntoChunks();
    
    contentChunks.forEach((chunk, index) => {
      setTimeout(() => {
        this.renderChunk(chunk);
      }, index * 100); // Renderizar cada chunk con 100ms de diferencia
    });
  }

  /**
   * Dividir contenido en chunks
   */
  divideContentIntoChunks() {
    const mainContent = document.querySelector('main, .main-content, #root');
    if (!mainContent) return [];

    const chunks = [];
    const children = Array.from(mainContent.children);
    
    // Chunk 1: Header y navegación (crítico)
    const headerChunk = children.filter(child => 
      child.tagName === 'HEADER' || 
      child.classList.contains('navbar') ||
      child.classList.contains('header')
    );
    
    // Chunk 2: Contenido principal (crítico)
    const mainChunk = children.filter(child => 
      child.classList.contains('dashboard') ||
      child.classList.contains('main-content') ||
      child.tagName === 'MAIN'
    );
    
    // Chunk 3: Sidebar (no crítico)
    const sidebarChunk = children.filter(child => 
      child.classList.contains('sidebar') ||
      child.classList.contains('navigation')
    );
    
    // Chunk 4: Footer (no crítico)
    const footerChunk = children.filter(child => 
      child.tagName === 'FOOTER' ||
      child.classList.contains('footer')
    );

    if (headerChunk.length > 0) chunks.push({ elements: headerChunk, priority: 'high' });
    if (mainChunk.length > 0) chunks.push({ elements: mainChunk, priority: 'high' });
    if (sidebarChunk.length > 0) chunks.push({ elements: sidebarChunk, priority: 'low' });
    if (footerChunk.length > 0) chunks.push({ elements: footerChunk, priority: 'low' });

    return chunks;
  }

  /**
   * Renderizar un chunk específico
   */
  renderChunk(chunk) {
    chunk.elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.3s, transform 0.3s';
      
      // Mostrar elemento con animación
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Optimizar CSS para renderizado más rápido
   */
  optimizeCSSForRendering() {
    // Inyectar CSS optimizado para renderizado
    const optimizedCSS = `
      /* CSS optimizado para Speed Index */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        color: #333;
        background: #fff;
      }
      
      /* Optimizar renderizado de elementos */
      .optimized-render {
        contain: layout style paint;
        will-change: auto;
      }
      
      /* Skeleton loaders para contenido no crítico */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Optimizar transiciones */
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    const style = document.createElement('style');
    style.textContent = optimizedCSS;
    document.head.appendChild(style);
  }

  /**
   * Implementar lazy loading inteligente
   */
  implementSmartLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.loadLazyElement(element);
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    lazyElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Cargar elemento lazy
   */
  loadLazyElement(element) {
    const src = element.dataset.src;
    if (src) {
      if (element.tagName === 'IMG') {
        element.src = src;
        element.classList.add('fade-in');
      } else if (element.tagName === 'DIV') {
        element.innerHTML = src;
        element.classList.add('fade-in');
      }
    }
  }

  /**
   * Optimizar JavaScript para renderizado
   */
  optimizeJavaScriptRendering() {
    // Usar requestIdleCallback para tareas no críticas
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        this.processNonCriticalTasks();
      });
    } else {
      setTimeout(() => {
        this.processNonCriticalTasks();
      }, 100);
    }
  }

  /**
   * Procesar tareas no críticas
   */
  processNonCriticalTasks() {
    // Inicializar componentes no críticos
    const nonCriticalComponents = document.querySelectorAll('[data-non-critical]');
    nonCriticalComponents.forEach(component => {
      component.classList.add('fade-in');
    });
  }

  /**
   * Optimizar imágenes para renderizado rápido
   */
  optimizeImagesForRendering() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Asegurar que las imágenes tengan dimensiones
      if (!img.width || !img.height) {
        img.style.aspectRatio = '16/9';
        img.style.objectFit = 'cover';
      }
      
      // Optimizar carga
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Agregar placeholder
      if (!img.style.background) {
        img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        img.style.backgroundSize = '200% 100%';
        img.style.animation = 'loading 1.5s infinite';
      }
    });
  }

  /**
   * Aplicar todas las optimizaciones de Speed Index
   */
  applyAllOptimizations() {
    console.log('🚀 Aplicando optimizaciones de Speed Index...');
    
    this.optimizeCSSForRendering();
    this.implementProgressiveRendering();
    this.implementSmartLazyLoading();
    this.optimizeJavaScriptRendering();
    this.optimizeImagesForRendering();
    
    console.log('✅ Optimizaciones de Speed Index aplicadas');
  }

  /**
   * Obtener métricas de Speed Index
   */
  getSpeedIndexMetrics() {
    return new Promise((resolve) => {
      // Simular cálculo de Speed Index
      const startTime = performance.now();
      
      // Medir tiempo de renderizado
      const measureRenderTime = () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        resolve({
          renderTime,
          speedIndex: renderTime / 1000, // Convertir a segundos
          timestamp: new Date().toISOString()
        });
      };
      
      // Medir después de que el contenido esté cargado
      if (document.readyState === 'complete') {
        measureRenderTime();
      } else {
        window.addEventListener('load', measureRenderTime);
      }
    });
  }
}

// Instancia global
export const speedIndexOptimizer = new SpeedIndexOptimizer();

// Función para inicializar automáticamente
export function initSpeedIndexOptimizer() {
  // Aplicar optimizaciones inmediatamente
  speedIndexOptimizer.applyAllOptimizations();
  
  return speedIndexOptimizer;
}

// Exportar para uso global
window.speedIndexOptimizer = speedIndexOptimizer;
window.initSpeedIndexOptimizer = initSpeedIndexOptimizer;

export default speedIndexOptimizer;
