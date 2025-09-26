/**
 * Optimizador de Cumulative Layout Shift (CLS)
 * 
 * Este módulo proporciona herramientas específicas
 * para reducir y monitorear el CLS en la aplicación.
 */

class CLSOptimizer {
  constructor() {
    this.observers = new Map();
    this.shifts = [];
    this.isMonitoring = false;
  }

  /**
   * Iniciar monitoreo de CLS
   */
  startMonitoring() {
    if (this.isMonitoring || !window.PerformanceObserver) return;

    this.isMonitoring = true;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          this.shifts.push({
            value: entry.value,
            sources: entry.sources,
            timestamp: entry.startTime,
            url: window.location.href
          });
          
          console.warn(`⚠️ Layout Shift detectado: ${entry.value.toFixed(4)}`);
          this.analyzeShift(entry);
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('layout-shift', observer);
  }

  /**
   * Analizar un layout shift específico
   */
  analyzeShift(entry) {
    const sources = entry.sources || [];
    
    sources.forEach(source => {
      if (source.node) {
        console.log('🔍 Elemento causante del shift:', source.node);
        console.log('📏 Dimensiones:', {
          width: source.node.offsetWidth,
          height: source.node.offsetHeight
        });
        
        // Aplicar correcciones automáticas
        this.applyCorrections(source.node);
      }
    });
  }

  /**
   * Aplicar correcciones automáticas
   */
  applyCorrections(element) {
    // Reservar espacio para imágenes
    if (element.tagName === 'IMG' && !element.style.aspectRatio) {
      element.style.aspectRatio = '16/9';
      element.style.objectFit = 'cover';
    }

    // Reservar espacio para contenido dinámico
    if (element.classList.contains('dynamic-content')) {
      element.style.minHeight = '200px';
    }

    // Aplicar contain: layout
    if (!element.style.contain) {
      element.style.contain = 'layout';
    }
  }

  /**
   * Prevenir layout shift en imágenes
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Asegurar que las imágenes tengan dimensiones
      if (!img.width || !img.height) {
        img.style.aspectRatio = '16/9';
        img.style.objectFit = 'cover';
      }

      // Agregar placeholder
      if (!img.style.background) {
        img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        img.style.backgroundSize = '200% 100%';
        img.style.animation = 'loading 1.5s infinite';
      }
    });
  }

  /**
   * Prevenir layout shift en listas dinámicas
   */
  optimizeLists() {
    const lists = document.querySelectorAll('.dynamic-list, .data-table, .estudiantes-list');
    
    lists.forEach(list => {
      if (!list.style.minHeight) {
        list.style.minHeight = '200px';
      }
      
      // Agregar skeleton loader si está vacío
      if (list.children.length === 0) {
        const skeleton = this.createSkeletonLoader(5);
        list.appendChild(skeleton);
      }
    });
  }

  /**
   * Crear skeleton loader
   */
  createSkeletonLoader(itemCount = 5) {
    const container = document.createElement('div');
    container.className = 'skeleton-container';
    
    for (let i = 0; i < itemCount; i++) {
      const item = document.createElement('div');
      item.className = 'skeleton-item';
      item.innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 60%;"></div>
      `;
      container.appendChild(item);
    }
    
    return container;
  }

  /**
   * Prevenir layout shift en modales
   */
  optimizeModals() {
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    
    modals.forEach(modal => {
      // Asegurar que el modal tenga dimensiones fijas
      if (!modal.style.minHeight) {
        modal.style.minHeight = '300px';
      }
      
      if (!modal.style.minWidth) {
        modal.style.minWidth = '400px';
      }
    });
  }

  /**
   * Optimizar formularios
   */
  optimizeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        // Asegurar que los inputs tengan altura mínima
        if (!input.style.minHeight) {
          input.style.minHeight = '40px';
        }
      });
    });
  }

  /**
   * Aplicar todas las optimizaciones
   */
  applyAllOptimizations() {
    console.log('🔧 Aplicando optimizaciones de CLS...');
    
    this.optimizeImages();
    this.optimizeLists();
    this.optimizeModals();
    this.optimizeForms();
    
    console.log('✅ Optimizaciones de CLS aplicadas');
  }

  /**
   * Obtener métricas de CLS
   */
  getMetrics() {
    const totalCLS = this.shifts.reduce((sum, shift) => sum + shift.value, 0);
    const maxCLS = Math.max(...this.shifts.map(shift => shift.value), 0);
    const shiftCount = this.shifts.length;
    
    return {
      totalCLS,
      maxCLS,
      shiftCount,
      shifts: this.shifts,
      averageCLS: shiftCount > 0 ? totalCLS / shiftCount : 0
    };
  }

  /**
   * Generar reporte de CLS
   */
  generateReport() {
    const metrics = this.getMetrics();
    
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics,
      recommendations: this.generateRecommendations(metrics)
    };
    
    console.log('📊 Reporte de CLS:', report);
    return report;
  }

  /**
   * Generar recomendaciones
   */
  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.totalCLS > 0.1) {
      recommendations.push({
        issue: 'CLS alto',
        suggestion: 'Reserva espacio para imágenes y contenido dinámico',
        priority: 'high'
      });
    }
    
    if (metrics.shiftCount > 5) {
      recommendations.push({
        issue: 'Muchos layout shifts',
        suggestion: 'Usa skeleton loaders y reserva espacio',
        priority: 'medium'
      });
    }
    
    if (metrics.maxCLS > 0.25) {
      recommendations.push({
        issue: 'Layout shift individual muy alto',
        suggestion: 'Revisa elementos con dimensiones dinámicas',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  /**
   * Detener monitoreo
   */
  stopMonitoring() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.isMonitoring = false;
  }

  /**
   * Limpiar datos
   */
  cleanup() {
    this.stopMonitoring();
    this.shifts = [];
  }
}

// Instancia global
export const clsOptimizer = new CLSOptimizer();

// Función para inicializar automáticamente
export function initCLSOptimizer() {
  // Iniciar monitoreo
  clsOptimizer.startMonitoring();
  
  // Aplicar optimizaciones cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      clsOptimizer.applyAllOptimizations();
    });
  } else {
    clsOptimizer.applyAllOptimizations();
  }
  
  // Aplicar optimizaciones cuando cambie el contenido
  const observer = new MutationObserver(() => {
    clsOptimizer.applyAllOptimizations();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return clsOptimizer;
}

// Exportar para uso global
window.clsOptimizer = clsOptimizer;
window.initCLSOptimizer = initCLSOptimizer;

export default clsOptimizer;
