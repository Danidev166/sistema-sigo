/**
 * Optimizador Principal de Rendimiento
 * 
 * Este módulo combina todas las optimizaciones de rendimiento
 * para mejorar el Performance Score de 79 a 90+
 */

import { fcpOptimizer } from './fcpOptimizer';
import { lcpOptimizer } from './lcpOptimizer';
import { speedIndexOptimizer } from './speedIndexOptimizer';
import { renderBlockingOptimizer } from './renderBlockingOptimizer';
import { clsOptimizer } from './clsOptimizer';

class PerformanceOptimizer {
  constructor() {
    this.optimizers = {
      fcp: fcpOptimizer,
      lcp: lcpOptimizer,
      speedIndex: speedIndexOptimizer,
      renderBlocking: renderBlockingOptimizer,
      cls: clsOptimizer
    };
    
    this.isInitialized = false;
    this.metrics = {};
  }

  /**
   * Inicializar todas las optimizaciones
   */
  async initialize() {
    if (this.isInitialized) return;

    console.log('🚀 Inicializando optimizador de rendimiento...');
    
    try {
      // Aplicar optimizaciones en orden de prioridad
      await this.applyOptimizations();
      
      // Iniciar monitoreo
      this.startMonitoring();
      
      this.isInitialized = true;
      console.log('✅ Optimizador de rendimiento inicializado');
      
    } catch (error) {
      console.error('❌ Error inicializando optimizador:', error);
    }
  }

  /**
   * Aplicar todas las optimizaciones
   */
  async applyOptimizations() {
    // 1. Optimizaciones críticas (aplicar inmediatamente)
    this.optimizers.fcp.applyAllOptimizations();
    this.optimizers.lcp.applyAllOptimizations();
    this.optimizers.cls.applyAllOptimizations();
    
    // 2. Optimizaciones de renderizado (aplicar después de un breve delay)
    setTimeout(() => {
      this.optimizers.renderBlocking.applyAllOptimizations();
      this.optimizers.speedIndex.applyAllOptimizations();
    }, 100);
  }

  /**
   * Iniciar monitoreo de rendimiento
   */
  startMonitoring() {
    // Monitorear métricas cada 5 segundos
    setInterval(() => {
      this.collectMetrics();
    }, 5000);
    
    // Monitorear cambios en el DOM
    const observer = new MutationObserver(() => {
      this.optimizeNewElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Recopilar métricas de rendimiento
   */
  async collectMetrics() {
    try {
      const metrics = {
        fcp: await this.getFCPMetrics(),
        lcp: await this.getLCPMetrics(),
        cls: this.optimizers.cls.getMetrics(),
        renderBlocking: this.optimizers.renderBlocking.getRenderBlockingMetrics(),
        speedIndex: await this.optimizers.speedIndex.getSpeedIndexMetrics()
      };
      
      this.metrics = metrics;
      this.analyzeMetrics(metrics);
      
    } catch (error) {
      console.error('❌ Error recopilando métricas:', error);
    }
  }

  /**
   * Obtener métricas de FCP
   */
  async getFCPMetrics() {
    return new Promise((resolve) => {
      if (!window.PerformanceObserver) {
        resolve(null);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          resolve({
            value: fcpEntry.startTime,
            timestamp: new Date().toISOString()
          });
          observer.disconnect();
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      
      // Timeout después de 10 segundos
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 10000);
    });
  }

  /**
   * Obtener métricas de LCP
   */
  async getLCPMetrics() {
    return await this.optimizers.lcp.getLCPMetrics();
  }

  /**
   * Analizar métricas y aplicar correcciones
   */
  analyzeMetrics(metrics) {
    const recommendations = [];
    
    // Analizar FCP
    if (metrics.fcp && metrics.fcp.value > 1800) {
      recommendations.push({
        metric: 'FCP',
        issue: 'First Contentful Paint lento',
        value: metrics.fcp.value,
        suggestion: 'Optimizar CSS crítico y recursos de carga inicial'
      });
    }
    
    // Analizar LCP
    if (metrics.lcp && metrics.lcp.value > 2500) {
      recommendations.push({
        metric: 'LCP',
        issue: 'Largest Contentful Paint lento',
        value: metrics.lcp.value,
        suggestion: 'Optimizar elemento más grande de la página'
      });
    }
    
    // Analizar CLS
    if (metrics.cls && metrics.cls.totalCLS > 0.1) {
      recommendations.push({
        metric: 'CLS',
        issue: 'Cumulative Layout Shift alto',
        value: metrics.cls.totalCLS,
        suggestion: 'Reservar espacio para contenido dinámico'
      });
    }
    
    // Aplicar correcciones automáticas
    if (recommendations.length > 0) {
      console.warn('⚠️ Problemas de rendimiento detectados:', recommendations);
      this.applyAutomaticCorrections(recommendations);
    }
  }

  /**
   * Aplicar correcciones automáticas
   */
  applyAutomaticCorrections(recommendations) {
    recommendations.forEach(rec => {
      switch (rec.metric) {
        case 'FCP':
          this.optimizers.fcp.applyAllOptimizations();
          break;
        case 'LCP':
          this.optimizers.lcp.applyAllOptimizations();
          break;
        case 'CLS':
          this.optimizers.cls.applyAllOptimizations();
          break;
      }
    });
  }

  /**
   * Optimizar elementos nuevos en el DOM
   */
  optimizeNewElements() {
    // Optimizar imágenes nuevas
    const newImages = document.querySelectorAll('img:not([data-optimized])');
    newImages.forEach(img => {
      img.setAttribute('data-optimized', 'true');
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
    });
    
    // Optimizar listas nuevas
    const newLists = document.querySelectorAll('.dynamic-list:not([data-optimized])');
    newLists.forEach(list => {
      list.setAttribute('data-optimized', 'true');
      if (!list.style.minHeight) {
        list.style.minHeight = '200px';
      }
    });
  }

  /**
   * Generar reporte completo de rendimiento
   */
  async generateReport() {
    await this.collectMetrics();
    
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics: this.metrics,
      performanceScore: this.calculatePerformanceScore(),
      recommendations: this.generateRecommendations(),
      optimizations: {
        fcp: 'Aplicado',
        lcp: 'Aplicado',
        cls: 'Aplicado',
        renderBlocking: 'Aplicado',
        speedIndex: 'Aplicado'
      }
    };
    
    console.log('📊 Reporte completo de rendimiento:', report);
    return report;
  }

  /**
   * Calcular puntuación de rendimiento
   */
  calculatePerformanceScore() {
    const metrics = this.metrics;
    let score = 100;
    
    // Penalizar por FCP lento
    if (metrics.fcp && metrics.fcp.value > 1800) {
      score -= Math.min(20, (metrics.fcp.value - 1800) / 100);
    }
    
    // Penalizar por LCP lento
    if (metrics.lcp && metrics.lcp.value > 2500) {
      score -= Math.min(20, (metrics.lcp.value - 2500) / 100);
    }
    
    // Penalizar por CLS alto
    if (metrics.cls && metrics.cls.totalCLS > 0.1) {
      score -= Math.min(15, metrics.cls.totalCLS * 100);
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Generar recomendaciones
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.fcp && this.metrics.fcp.value > 1800) {
      recommendations.push('Optimizar CSS crítico y recursos de carga inicial');
    }
    
    if (this.metrics.lcp && this.metrics.lcp.value > 2500) {
      recommendations.push('Optimizar elemento más grande de la página');
    }
    
    if (this.metrics.cls && this.metrics.cls.totalCLS > 0.1) {
      recommendations.push('Reservar espacio para contenido dinámico');
    }
    
    if (this.metrics.renderBlocking && this.metrics.renderBlocking.blockingResourcesCount > 5) {
      recommendations.push('Eliminar recursos que bloquean el renderizado');
    }
    
    return recommendations;
  }

  /**
   * Limpiar optimizador
   */
  cleanup() {
    Object.values(this.optimizers).forEach(optimizer => {
      if (optimizer.cleanup) {
        optimizer.cleanup();
      }
    });
    
    this.isInitialized = false;
  }
}

// Instancia global
export const performanceOptimizer = new PerformanceOptimizer();

// Función para inicializar automáticamente
export function initPerformanceOptimizer() {
  return performanceOptimizer.initialize();
}

// Exportar para uso global
window.performanceOptimizer = performanceOptimizer;
window.initPerformanceOptimizer = initPerformanceOptimizer;

export default performanceOptimizer;
