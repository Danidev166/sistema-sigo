#!/usr/bin/env node

/**
 * Script de Análisis de Rendimiento para SIGO
 * 
 * Este script analiza el bundle de la aplicación y proporciona
 * recomendaciones de optimización de rendimiento.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Análisis de Rendimiento - Sistema SIGO\n');

// 1. Análisis del bundle
function analyzeBundle() {
  console.log('📦 Análisis del Bundle:');
  
  const distPath = path.join(__dirname, 'sigo-frontend/dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ No se encontró la carpeta dist. Ejecuta "npm run build" primero.');
    return;
  }
  
  const assets = fs.readdirSync(distPath);
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  const cssFiles = assets.filter(file => file.endsWith('.css'));
  
  console.log(`   - Archivos JS: ${jsFiles.length}`);
  console.log(`   - Archivos CSS: ${cssFiles.length}`);
  
  // Analizar tamaños
  let totalJSSize = 0;
  let totalCSSSize = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    totalJSSize += stats.size;
    console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
  });
  
  cssFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    totalCSSSize += stats.size;
    console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
  });
  
  console.log(`\n📊 Resumen de Tamaños:`);
  console.log(`   - Total JS: ${(totalJSSize / 1024).toFixed(2)} KB`);
  console.log(`   - Total CSS: ${(totalCSSSize / 1024).toFixed(2)} KB`);
  console.log(`   - Total: ${((totalJSSize + totalCSSSize) / 1024).toFixed(2)} KB`);
  
  // Recomendaciones
  console.log(`\n💡 Recomendaciones:`);
  if (totalJSSize > 500 * 1024) {
    console.log('   ⚠️  Bundle JS muy grande (>500KB). Considera code splitting.');
  }
  if (totalCSSSize > 100 * 1024) {
    console.log('   ⚠️  CSS muy grande (>100KB). Considera purgar CSS no usado.');
  }
  if (jsFiles.length > 5) {
    console.log('   ⚠️  Muchos archivos JS. Considera agrupar chunks.');
  }
}

// 2. Análisis de dependencias
function analyzeDependencies() {
  console.log('\n📚 Análisis de Dependencias:');
  
  const packagePath = path.join(__dirname, 'sigo-frontend/package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ No se encontró package.json');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`   - Dependencias de producción: ${dependencies.length}`);
  console.log(`   - Dependencias de desarrollo: ${devDependencies.length}`);
  
  // Dependencias pesadas conocidas
  const heavyDeps = [
    'react-dom',
    'react-router-dom',
    'axios',
    'lucide-react',
    'react-hot-toast',
    'headlessui'
  ];
  
  const foundHeavy = dependencies.filter(dep => heavyDeps.includes(dep));
  console.log(`   - Dependencias pesadas: ${foundHeavy.join(', ')}`);
}

// 3. Recomendaciones de optimización
function generateRecommendations() {
  console.log('\n🎯 Recomendaciones de Optimización:');
  
  console.log('\n1. 🚀 Code Splitting Avanzado:');
  console.log('   - Implementar lazy loading por rutas');
  console.log('   - Separar vendor chunks');
  console.log('   - Preload de rutas críticas');
  
  console.log('\n2. 📦 Optimización de Bundle:');
  console.log('   - Tree shaking para eliminar código no usado');
  console.log('   - Minificación avanzada');
  console.log('   - Compresión gzip/brotli');
  
  console.log('\n3. 🖼️ Optimización de Assets:');
  console.log('   - Lazy loading de imágenes');
  console.log('   - WebP para imágenes modernas');
  console.log('   - SVGs optimizados');
  
  console.log('\n4. ⚡ Rendimiento en Tiempo de Ejecución:');
  console.log('   - Memoización de componentes pesados');
  console.log('   - Virtualización de listas largas');
  console.log('   - Debounce en búsquedas');
  
  console.log('\n5. 🌐 Optimización de Red:');
  console.log('   - Service Workers para cache');
  console.log('   - Prefetch de recursos críticos');
  console.log('   - CDN para assets estáticos');
}

// 4. Herramientas de medición
function measurementTools() {
  console.log('\n🔧 Herramientas de Medición:');
  
  console.log('\n1. Lighthouse:');
  console.log('   npm install -g lighthouse');
  console.log('   lighthouse https://sigo-frontend-2025.onrender.com --view');
  
  console.log('\n2. Web Vitals:');
  console.log('   - Chrome DevTools → Lighthouse');
  console.log('   - PageSpeed Insights: https://pagespeed.web.dev/');
  
  console.log('\n3. Bundle Analyzer:');
  console.log('   npm install --save-dev webpack-bundle-analyzer');
  console.log('   npm run build -- --analyze');
  
  console.log('\n4. React DevTools Profiler:');
  console.log('   - Chrome Extension: React Developer Tools');
  console.log('   - Profiler tab para identificar componentes lentos');
}

// Ejecutar análisis
console.log('🔍 Iniciando análisis...\n');

analyzeBundle();
analyzeDependencies();
generateRecommendations();
measurementTools();

console.log('\n✅ Análisis completado!');
console.log('\n📝 Próximos pasos:');
console.log('1. Ejecuta "npm run build" para generar el bundle');
console.log('2. Ejecuta este script: "node performance-analysis.js"');
console.log('3. Usa Lighthouse para medir rendimiento real');
console.log('4. Implementa las optimizaciones recomendadas');
