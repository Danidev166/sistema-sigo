/**
 * Script de Prueba de Rendimiento
 * 
 * Ejecuta este script en la consola del navegador para
 * medir el rendimiento de tu aplicación SIGO.
 */

// Función para medir tiempo de carga de componentes
function measureComponentLoad(componentName, loadFunction) {
  const start = performance.now();
  const result = loadFunction();
  const end = performance.now();
  
  console.log(`🚀 ${componentName} cargado en ${(end - start).toFixed(2)}ms`);
  return result;
}

// Función para medir tiempo de renderizado
function measureRenderTime(componentName, renderFunction) {
  const start = performance.now();
  const result = renderFunction();
  const end = performance.now();
  
  const duration = end - start;
  if (duration > 100) {
    console.warn(`⚠️ ${componentName} renderizado en ${duration.toFixed(2)}ms (LENTO)`);
  } else {
    console.log(`✅ ${componentName} renderizado en ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

// Función para medir tiempo de API calls
function measureAPICall(endpoint, apiCall) {
  const start = performance.now();
  
  return apiCall().then(result => {
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 1000) {
      console.warn(`⚠️ API ${endpoint} tardó ${duration.toFixed(2)}ms (LENTO)`);
    } else {
      console.log(`✅ API ${endpoint} completada en ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }).catch(error => {
    const end = performance.now();
    console.error(`❌ API ${endpoint} falló en ${(end - start).toFixed(2)}ms:`, error);
    throw error;
  });
}

// Función para medir Web Vitals
function measureWebVitals() {
  return new Promise((resolve) => {
    const vitals = {};
    
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          vitals.fcp = entry.startTime;
          console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = lastEntry.startTime;
      console.log(`🖼️ Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        vitals.fid = entry.processingStart - entry.startTime;
        console.log(`⚡ First Input Delay: ${vitals.fid.toFixed(2)}ms`);
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
      console.log(`📐 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // Resolver después de 5 segundos
    setTimeout(() => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      
      console.log('📊 Web Vitals completados:', vitals);
      resolve(vitals);
    }, 5000);
  });
}

// Función para analizar bundle size
function analyzeBundleSize() {
  const resources = performance.getEntriesByType('resource');
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let imageSize = 0;
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    totalSize += size;
    
    if (resource.name.includes('.js')) {
      jsSize += size;
    } else if (resource.name.includes('.css')) {
      cssSize += size;
    } else if (resource.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
      imageSize += size;
    }
  });
  
  console.log('📦 Análisis de Bundle:');
  console.log(`   Total: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   JavaScript: ${(jsSize / 1024).toFixed(2)} KB`);
  console.log(`   CSS: ${(cssSize / 1024).toFixed(2)} KB`);
  console.log(`   Imágenes: ${(imageSize / 1024).toFixed(2)} KB`);
  
  return { totalSize, jsSize, cssSize, imageSize };
}

// Función para detectar componentes lentos
function detectSlowComponents() {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.duration > 100) {
        console.warn(`⚠️ Operación lenta detectada: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
  
  return observer;
}

// Función principal para ejecutar todas las pruebas
async function runPerformanceTest() {
  console.log('🚀 Iniciando Prueba de Rendimiento SIGO...\n');
  
  // 1. Analizar bundle size
  console.log('1. Analizando tamaño del bundle...');
  analyzeBundleSize();
  
  // 2. Medir Web Vitals
  console.log('\n2. Midiendo Web Vitals...');
  const vitals = await measureWebVitals();
  
  // 3. Detectar componentes lentos
  console.log('\n3. Detectando componentes lentos...');
  const slowComponentObserver = detectSlowComponents();
  
  // 4. Generar reporte
  console.log('\n4. Generando reporte...');
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    vitals,
    bundle: analyzeBundleSize(),
    recommendations: generateRecommendations(vitals)
  };
  
  console.log('📊 Reporte de Rendimiento:', report);
  
  // Limpiar observadores
  setTimeout(() => {
    slowComponentObserver.disconnect();
  }, 10000);
  
  return report;
}

// Función para generar recomendaciones
function generateRecommendations(vitals) {
  const recommendations = [];
  
  if (vitals.fcp > 1800) {
    recommendations.push({
      issue: 'First Contentful Paint lento',
      suggestion: 'Optimiza el CSS crítico y reduce el JavaScript inicial'
    });
  }
  
  if (vitals.lcp > 2500) {
    recommendations.push({
      issue: 'Largest Contentful Paint lento',
      suggestion: 'Optimiza imágenes y recursos críticos'
    });
  }
  
  if (vitals.fid > 100) {
    recommendations.push({
      issue: 'First Input Delay alto',
      suggestion: 'Reduce el JavaScript de larga duración'
    });
  }
  
  if (vitals.cls > 0.1) {
    recommendations.push({
      issue: 'Cumulative Layout Shift alto',
      suggestion: 'Reserva espacio para imágenes y evita cambios de layout'
    });
  }
  
  return recommendations;
}

// Exportar funciones para uso global
window.performanceTest = {
  run: runPerformanceTest,
  measureComponentLoad,
  measureRenderTime,
  measureAPICall,
  measureWebVitals,
  analyzeBundleSize,
  detectSlowComponents
};

console.log('🔧 Herramientas de rendimiento cargadas. Ejecuta: performanceTest.run()');
