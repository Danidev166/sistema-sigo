# 🎨 Guía de Tipografía Institucional SIGO

## 📋 Resumen

Este documento describe el sistema de tipografía institucional implementado en SIGO, diseñado específicamente para sistemas gubernamentales e institucionales con enfoque en **legibilidad**, **accesibilidad** y **profesionalismo**.

## 🎯 Objetivos del Sistema

- ✅ **Consistencia** visual en toda la aplicación
- ✅ **Legibilidad** optimizada para pantallas digitales
- ✅ **Accesibilidad** para usuarios con necesidades especiales
- ✅ **Profesionalismo** apropiado para instituciones educativas
- ✅ **Rendimiento** optimizado con carga eficiente de fuentes

## 🔤 Fuentes Seleccionadas

### **1. Inter (Fuente Principal)**
- **Uso**: Interfaces, navegación, formularios, tablas
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Características**: 
  - Diseñada específicamente para interfaces digitales
  - Excelente legibilidad en pantallas
  - Usada por GitHub, Figma, Stripe
  - Optimizada para sistemas de gestión

### **2. Source Sans Pro (Fuente Secundaria)**
- **Uso**: Documentos, contenido largo, reportes
- **Pesos**: 300, 400, 600, 700
- **Características**:
  - Diseñada por Adobe para interfaces profesionales
  - Excelente legibilidad en documentos
  - Amplia gama de caracteres latinos
  - Usada en sistemas gubernamentales

### **3. JetBrains Mono (Fuente Monoespaciada)**
- **Uso**: Código, datos técnicos, logs
- **Pesos**: 400, 500, 600
- **Características**:
  - Diseñada para desarrolladores
  - Excelente legibilidad de código
  - Ligaduras para mejor lectura

## 📏 Jerarquía Tipográfica

### **Títulos**
```css
/* Título Principal */
.text-institutional-5xl  /* 48px, font-weight: 800 */

/* Título Secundario */
.text-institutional-4xl  /* 36px, font-weight: 700 */

/* Título Terciario */
.text-institutional-3xl  /* 30px, font-weight: 700 */

/* Título Cuaternario */
.text-institutional-2xl  /* 24px, font-weight: 600 */

/* Título Quinto */
.text-institutional-xl   /* 20px, font-weight: 600 */
```

### **Texto de Contenido**
```css
/* Texto destacado */
.text-institutional-lg   /* 18px, font-weight: 500 */

/* Texto base */
.text-institutional-base /* 16px, font-weight: 400 */

/* Texto secundario */
.text-institutional-sm   /* 14px, font-weight: 400 */

/* Texto pequeño */
.text-institutional-xs   /* 12px, font-weight: 400 */
```

## 🎨 Clases Especializadas

### **Documentos Institucionales**
```css
.text-document           /* Para contenido largo */
.text-document-heading   /* Para títulos de documentos */
.prose-institutional     /* Para párrafos de contenido */
```

### **Formularios**
```css
.text-form-label         /* Etiquetas de formularios */
.text-form-input         /* Campos de entrada */
.text-form-help          /* Texto de ayuda */
```

### **Tablas de Datos**
```css
.text-table-header       /* Encabezados de tabla */
.text-table-cell         /* Celdas de tabla */
```

### **Navegación**
```css
.text-nav-title          /* Título de navegación */
.text-nav-item           /* Elementos de menú */
```

### **Alertas y Notificaciones**
```css
.text-alert              /* Texto de alerta */
.text-alert-title        /* Título de alerta */
```

### **Código**
```css
.text-code               /* Código inline */
.text-code-block         /* Bloques de código */
```

## 🎯 Uso en Tailwind CSS

### **Clases de Fuente**
```html
<!-- Fuente principal (Inter) -->
<div class="font-sans">Contenido con Inter</div>

<!-- Fuente de documentos (Source Sans Pro) -->
<div class="font-document">Documento institucional</div>

<!-- Fuente monoespaciada (JetBrains Mono) -->
<code class="font-mono">código</code>

<!-- Alias para consistencia -->
<div class="font-primary">Fuente principal</div>
<div class="font-secondary">Fuente secundaria</div>
```

### **Tamaños de Fuente**
```html
<!-- Usando clases de Tailwind -->
<h1 class="text-5xl font-extrabold">Título Principal</h1>
<h2 class="text-4xl font-bold">Título Secundario</h2>
<p class="text-base">Texto base</p>
<p class="text-sm">Texto secundario</p>
```

## ♿ Accesibilidad

### **Utilidades de Accesibilidad**
```css
.text-high-contrast      /* Alto contraste */
.text-large-print        /* Impresión grande */
```

### **Mejores Prácticas**
- ✅ Usar `font-weight: 600` o superior para títulos
- ✅ Mantener `line-height: 1.5` para contenido largo
- ✅ Usar `letter-spacing: 0.025em` para texto en mayúsculas
- ✅ Asegurar contraste mínimo de 4.5:1
- ✅ Probar con lectores de pantalla

## 📱 Responsive Design

### **Breakpoints**
```css
/* Móvil (max-width: 640px) */
@media (max-width: 640px) {
  .text-institutional-5xl { font-size: 2.25rem; } /* 36px */
  .text-institutional-4xl { font-size: 1.875rem; } /* 30px */
  .text-institutional-3xl { font-size: 1.5rem; } /* 24px */
}
```

## 🚀 Optimización de Rendimiento

### **Carga de Fuentes**
- ✅ Uso de `font-display: swap` para mejor rendimiento
- ✅ Preload de fuentes críticas
- ✅ Subset de caracteres para reducir tamaño
- ✅ Fallbacks a fuentes del sistema

### **Variables CSS**
```css
:root {
  --font-primary: 'Inter', ui-sans-serif, system-ui, ...;
  --font-secondary: 'Source Sans Pro', ui-sans-serif, ...;
  --font-mono: 'JetBrains Mono', ui-monospace, ...;
}
```

## 📝 Ejemplos de Uso

### **Página de Estudiante**
```html
<div class="space-y-6">
  <h1 class="text-institutional-4xl font-bold text-gray-900">
    Información del Estudiante
  </h1>
  
  <div class="prose-institutional">
    <h2 class="text-document-heading mb-4">Datos Personales</h2>
    <p class="text-document">
      Información detallada del estudiante...
    </p>
  </div>
  
  <form class="space-y-4">
    <label class="text-form-label block">Nombre Completo</label>
    <input class="text-form-input w-full px-3 py-2 border rounded-md" />
    <p class="text-form-help">Este campo es obligatorio</p>
  </form>
</div>
```

### **Tabla de Datos**
```html
<table class="min-w-full border border-gray-300">
  <thead class="bg-gray-50">
    <tr>
      <th class="text-table-header px-4 py-2 text-left">ID</th>
      <th class="text-table-header px-4 py-2 text-left">Nombre</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="text-table-cell px-4 py-2">001</td>
      <td class="text-table-cell px-4 py-2">Juan Pérez</td>
    </tr>
  </tbody>
</table>
```

## 🔧 Implementación Técnica

### **Archivos Principales**
- `src/styles/institutional-typography.css` - Sistema completo de tipografía
- `tailwind.config.js` - Configuración de Tailwind
- `src/styles/design-tokens.js` - Tokens de diseño
- `src/components/typography/TypographyShowcase.jsx` - Componente de demostración

### **Importación**
```javascript
// En main.jsx
import './styles/institutional-typography.css';
```

## 📊 Métricas de Rendimiento

### **Tamaño de Fuentes**
- **Inter**: ~150KB (todos los pesos)
- **Source Sans Pro**: ~120KB (todos los pesos)
- **JetBrains Mono**: ~80KB (todos los pesos)
- **Total**: ~350KB (optimizado con subset)

### **Tiempo de Carga**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🎨 Paleta de Colores Compatible

### **Colores de Texto**
```css
/* Grises institucionales */
.text-gray-900  /* Títulos principales */
.text-gray-700  /* Texto base */
.text-gray-600  /* Texto secundario */
.text-gray-500  /* Texto deshabilitado */

/* Colores de marca SIGO */
.text-sigo-700  /* Azul institucional */
.text-sigo-600  /* Azul secundario */
```

## 🔄 Migración

### **Antes (Inconsistente)**
```html
<h1 class="text-3xl font-bold">Título</h1>
<p class="text-base">Contenido</p>
```

### **Después (Institucional)**
```html
<h1 class="text-institutional-4xl">Título</h1>
<p class="text-institutional-base">Contenido</p>
```

## 📚 Recursos Adicionales

- [Inter Font - Google Fonts](https://fonts.google.com/specimen/Inter)
- [Source Sans Pro - Adobe Fonts](https://fonts.adobe.com/fonts/source-sans-pro)
- [JetBrains Mono - JetBrains](https://www.jetbrains.com/lp/mono/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contribución

Para agregar nuevas clases de tipografía:

1. Definir la clase en `institutional-typography.css`
2. Agregar documentación en este archivo
3. Incluir ejemplo de uso
4. Probar accesibilidad y responsividad
5. Actualizar `TypographyShowcase.jsx`

---

**Última actualización**: 28 de enero de 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo SIGO
