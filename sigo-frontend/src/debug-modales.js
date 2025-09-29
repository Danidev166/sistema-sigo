/**
 * Script de debug para verificar modales en comunicación familiar
 * Verifica que no haya modales duplicados o no funcionales
 */

console.log('🔍 Verificando modales en comunicación familiar...');

// Verificar si hay elementos con clases de modal duplicadas
const modales = document.querySelectorAll('[class*="fixed inset-0"]');
console.log(`📊 Modales encontrados: ${modales.length}`);

modales.forEach((modal, index) => {
  console.log(`Modal ${index + 1}:`, {
    zIndex: window.getComputedStyle(modal).zIndex,
    display: window.getComputedStyle(modal).display,
    visibility: window.getComputedStyle(modal).visibility,
    classes: modal.className
  });
});

// Verificar si hay overlays duplicados
const overlays = document.querySelectorAll('[class*="bg-black"]');
console.log(`📊 Overlays encontrados: ${overlays.length}`);

// Verificar si hay botones de cerrar duplicados
const closeButtons = document.querySelectorAll('[class*="hover:bg-gray-100"]');
console.log(`📊 Botones de cerrar encontrados: ${closeButtons.length}`);

// Verificar z-index de elementos
const elementosConZIndex = document.querySelectorAll('[class*="z-"]');
console.log(`📊 Elementos con z-index: ${elementosConZIndex.length}`);

elementosConZIndex.forEach((elemento, index) => {
  const zIndex = window.getComputedStyle(elemento).zIndex;
  if (zIndex !== 'auto') {
    console.log(`Elemento ${index + 1}: z-index = ${zIndex}`, elemento.className);
  }
});

console.log('✅ Verificación completada');
