# 🎨 Guía de Headers Institucionales SIGO

## 📋 Resumen

Sistema de headers elegantes y profesionales para sistemas institucionales, diseñado para mejorar la experiencia visual y la jerarquía de información en la aplicación SIGO.

## 🎯 Problema Resuelto

**Antes**: Headers simples con texto negro sobre fondo blanco, sin jerarquía visual ni atractivo profesional.

**Después**: Headers elegantes con gradientes, sombras, iconos y tipografía institucional que mejoran significativamente la experiencia del usuario.

## 🎨 Tipos de Headers Disponibles

### **1. Header Institucional Principal**
```jsx
<InstitutionalHeader
  title="Gestión de Estudiantes"
  subtitle="Administra la información de los estudiantes del sistema"
  variant="primary"
  actions={[
    {
      label: "Agregar Estudiante",
      icon: Plus,
      onClick: () => setIsModalOpen(true),
      variant: "primary"
    }
  ]}
/>
```

**Características:**
- ✅ Gradiente azul institucional
- ✅ Sombras elegantes
- ✅ Efecto de brillo sutil
- ✅ Botones de acción integrados
- ✅ Responsive design

### **2. Header con Icono**
```jsx
<InstitutionalHeader
  title="Agenda de Entrevistas"
  subtitle="Gestiona las citaciones y entrevistas programadas"
  icon={Calendar}
  variant="with-icon"
  actions={[...]}
/>
```

**Características:**
- ✅ Icono destacado en contenedor azul
- ✅ Layout horizontal elegante
- ✅ Sombra en el icono
- ✅ Perfecto para páginas específicas

### **3. Header de Tabla**
```jsx
<TableHeader
  title="Gestión de Estudiantes"
  subtitle="Administra la información de los estudiantes del sistema"
  totalItems={estudiantes.length}
  actions={[...]}
  filters={[...]}
/>
```

**Características:**
- ✅ Diseño minimalista elegante
- ✅ Contador de elementos
- ✅ Botones de filtro y acción
- ✅ Borde inferior azul
- ✅ Ideal para páginas con tablas

### **4. Header de Sección**
```jsx
<SectionHeader
  title="Filtros Avanzados"
  badge="Nuevo"
  actions={[...]}
/>
```

**Características:**
- ✅ Diseño compacto
- ✅ Badge de estado
- ✅ Fondo gris claro
- ✅ Borde izquierdo azul
- ✅ Perfecto para subsecciones

### **5. Header con Búsqueda**
```jsx
<SearchHeader
  title="Buscar Estudiantes"
  subtitle="Encuentra estudiantes por nombre, RUT o curso"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={[...]}
  actions={[...]}
/>
```

**Características:**
- ✅ Campo de búsqueda integrado
- ✅ Botones de filtro
- ✅ Diseño responsive
- ✅ Perfecto para páginas de búsqueda

## 🎨 Paleta de Colores

### **Gradientes Principales**
```css
--header-gradient-primary: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
--header-gradient-secondary: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
```

### **Colores de Texto**
```css
--text-primary: #1e293b;    /* Títulos principales */
--text-secondary: #64748b;  /* Subtítulos */
--text-white: #ffffff;      /* Texto sobre gradientes */
```

### **Sombras**
```css
--header-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--header-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## 🎯 Componentes Disponibles

### **InstitutionalHeader**
Header principal con múltiples variantes.

**Props:**
- `title` (string): Título principal
- `subtitle` (string): Subtítulo opcional
- `icon` (Component): Icono opcional
- `variant` (string): 'primary', 'secondary', 'minimal', 'with-icon'
- `actions` (array): Botones de acción

### **TableHeader**
Header especializado para páginas con tablas.

**Props:**
- `title` (string): Título principal
- `subtitle` (string): Subtítulo opcional
- `totalItems` (number): Número total de elementos
- `actions` (array): Botones de acción
- `filters` (array): Botones de filtro

### **SectionHeader**
Header compacto para subsecciones.

**Props:**
- `title` (string): Título de la sección
- `badge` (string): Badge opcional
- `actions` (array): Botones de acción

### **SearchHeader**
Header con funcionalidad de búsqueda.

**Props:**
- `title` (string): Título principal
- `subtitle` (string): Subtítulo opcional
- `searchValue` (string): Valor del campo de búsqueda
- `onSearchChange` (function): Callback para cambios en búsqueda
- `filters` (array): Botones de filtro
- `actions` (array): Botones de acción

## 🎨 Botones de Acción

### **Estilos Disponibles**
```jsx
// Botón primario (sobre gradiente)
{
  label: "Agregar Estudiante",
  icon: Plus,
  onClick: () => {},
  variant: "primary"
}

// Botón secundario (sobre fondo claro)
{
  label: "Exportar PDF",
  icon: Download,
  onClick: () => {},
  variant: "secondary"
}
```

### **Características de Botones**
- ✅ Iconos integrados
- ✅ Efectos hover elegantes
- ✅ Transiciones suaves
- ✅ Estados disabled
- ✅ Responsive design

## 📱 Responsive Design

### **Breakpoints**
```css
/* Móvil (max-width: 768px) */
@media (max-width: 768px) {
  .header-institutional {
    padding: 1.25rem 1.5rem;
  }
  
  .header-institutional .header-actions {
    position: static;
    margin-top: 1rem;
  }
}
```

### **Adaptaciones Móviles**
- ✅ Layout vertical en pantallas pequeñas
- ✅ Botones apilados
- ✅ Iconos redimensionados
- ✅ Espaciado optimizado

## 🌙 Modo Oscuro

### **Adaptaciones Automáticas**
```css
@media (prefers-color-scheme: dark) {
  .header-secondary {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #f1f5f9;
  }
}
```

### **Colores de Modo Oscuro**
- ✅ Fondos oscuros elegantes
- ✅ Texto claro optimizado
- ✅ Bordes sutiles
- ✅ Contraste mejorado

## 🎨 Animaciones

### **Efectos Disponibles**
- ✅ **slideInDown**: Header principal
- ✅ **slideInLeft**: Header con icono
- ✅ **fadeInUp**: Header minimalista
- ✅ **Hover effects**: Botones y elementos interactivos

### **Transiciones**
```css
transition: all 0.2s ease;
transform: translateY(-1px);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
```

## 🚀 Implementación

### **1. Importar Componentes**
```jsx
import { 
  InstitutionalHeader, 
  TableHeader, 
  SectionHeader,
  SearchHeader,
  HeaderIcons 
} from '../../../components/headers/InstitutionalHeader';
```

### **2. Importar Estilos**
```jsx
// En main.jsx
import './styles/institutional-headers.css';
```

### **3. Usar en Componentes**
```jsx
<TableHeader
  title="Mi Página"
  subtitle="Descripción de la página"
  totalItems={items.length}
  actions={[
    {
      label: "Nueva Acción",
      icon: HeaderIcons.Add,
      onClick: handleNewAction,
      variant: "primary"
    }
  ]}
/>
```

## 📊 Comparación Antes vs Después

### **Antes (Headers Simples)**
- ❌ Texto negro sobre fondo blanco
- ❌ Sin jerarquía visual
- ❌ Apariencia básica
- ❌ Sin elementos visuales atractivos
- ❌ Experiencia de usuario plana

### **Después (Headers Institucionales)**
- ✅ Gradientes elegantes
- ✅ Sombras profesionales
- ✅ Iconos integrados
- ✅ Botones de acción atractivos
- ✅ Jerarquía visual clara
- ✅ Experiencia de usuario mejorada
- ✅ Diseño responsive
- ✅ Modo oscuro
- ✅ Animaciones suaves

## 🎯 Casos de Uso

### **Páginas Principales**
```jsx
<InstitutionalHeader
  title="Dashboard"
  subtitle="Panel de control del sistema"
  icon={Home}
  variant="with-icon"
/>
```

### **Páginas de Gestión**
```jsx
<TableHeader
  title="Gestión de Usuarios"
  subtitle="Administra los usuarios del sistema"
  totalItems={usuarios.length}
  actions={[
    { label: "Nuevo Usuario", icon: Plus, onClick: handleNewUser },
    { label: "Exportar", icon: Download, onClick: handleExport }
  ]}
/>
```

### **Páginas de Búsqueda**
```jsx
<SearchHeader
  title="Buscar Estudiantes"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={[
    { label: "Filtros", icon: Filter, onClick: handleFilters }
  ]}
/>
```

## 🔧 Personalización

### **Variables CSS Personalizables**
```css
:root {
  --header-gradient-primary: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
  --header-border-radius: 12px;
  --header-padding: 1.5rem 2rem;
  --header-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### **Clases de Utilidad**
```css
.header-compact    /* Padding reducido */
.header-large      /* Padding aumentado */
.header-spacing    /* Margen inferior estándar */
.header-divider    /* Línea divisoria elegante */
```

## 📚 Ejemplos Completos

### **Página de Estudiantes**
```jsx
<TableHeader
  title="Gestión de Estudiantes"
  subtitle="Administra la información de los estudiantes del sistema"
  totalItems={estudiantes.length}
  actions={[
    {
      label: "Exportar PDF",
      icon: FileDown,
      onClick: handleExportPDF,
      variant: "secondary"
    },
    {
      label: "Agregar Estudiante",
      icon: Plus,
      onClick: () => setIsModalOpen(true),
      variant: "primary"
    },
    {
      label: "Carga Masiva",
      icon: Upload,
      onClick: () => setIsBulkModalOpen(true),
      variant: "primary"
    }
  ]}
  filters={[
    {
      label: "Filtros",
      icon: Filter,
      onClick: () => setIsFilterOpen(true)
    }
  ]}
/>
```

### **Página de Agenda**
```jsx
<InstitutionalHeader
  title="Agenda de Entrevistas"
  subtitle="Gestiona las citaciones y entrevistas programadas"
  icon={Calendar}
  variant="with-icon"
  actions={[
    {
      label: "Agendar Entrevista",
      icon: Plus,
      onClick: () => setModalOpen(true),
      variant: "primary"
    }
  ]}
/>
```

## 🎉 Beneficios Implementados

### **Para Usuarios**
- ✅ **Experiencia visual mejorada** con headers atractivos
- ✅ **Jerarquía clara** de información
- ✅ **Navegación intuitiva** con botones de acción visibles
- ✅ **Diseño responsive** que se adapta a todos los dispositivos
- ✅ **Modo oscuro** para mejor experiencia nocturna

### **Para Desarrolladores**
- ✅ **Componentes reutilizables** para consistencia
- ✅ **API simple** y fácil de usar
- ✅ **Documentación completa** para referencia
- ✅ **Sistema escalable** para futuras funcionalidades

### **Para la Institución**
- ✅ **Imagen profesional** y moderna
- ✅ **Consistencia visual** en toda la aplicación
- ✅ **Mejor usabilidad** para los usuarios
- ✅ **Mantenimiento simplificado** del diseño

## 🚀 Próximos Pasos

### **Corto Plazo**
1. **Aplicar headers** a páginas restantes
2. **Probar responsive** en diferentes dispositivos
3. **Optimizar animaciones** para mejor rendimiento

### **Mediano Plazo**
1. **Crear más variantes** de headers
2. **Implementar temas** personalizables
3. **Desarrollar sistema** de iconografía consistente

### **Largo Plazo**
1. **Expandir sistema** a otras aplicaciones
2. **Crear biblioteca** de componentes de UI
3. **Implementar automatización** de testing visual

---

**Última actualización**: 28 de enero de 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo SIGO  
**Estado**: ✅ Implementado y Funcionando
