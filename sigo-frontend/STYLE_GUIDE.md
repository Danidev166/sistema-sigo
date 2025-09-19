# 🎨 Guía de Estilos - SIGO Frontend

## 📋 Índice

1. [Colores](#colores)
2. [Tipografía](#tipografía)
3. [Espaciado](#espaciado)
4. [Componentes](#componentes)
5. [Iconografía](#iconografía)
6. [Animaciones](#animaciones)
7. [Responsive Design](#responsive-design)
8. [Accesibilidad](#accesibilidad)

## 🎨 Colores

### Paleta Principal

```css
/* Colores primarios */
--primary-50: #eff6ff;   /* Azul muy claro */
--primary-100: #dbeafe;  /* Azul claro */
--primary-500: #3b82f6;  /* Azul principal */
--primary-600: #2563eb;  /* Azul oscuro */
--primary-700: #1d4ed8;  /* Azul muy oscuro */

/* Colores secundarios */
--secondary-50: #f8fafc;  /* Gris muy claro */
--secondary-100: #f1f5f9; /* Gris claro */
--secondary-500: #64748b; /* Gris principal */
--secondary-600: #475569; /* Gris oscuro */
--secondary-700: #334155; /* Gris muy oscuro */

/* Colores de estado */
--success-500: #10b981;   /* Verde éxito */
--warning-500: #f59e0b;   /* Amarillo advertencia */
--error-500: #ef4444;     /* Rojo error */
--info-500: #06b6d4;      /* Azul información */
```

### Uso de Colores

```jsx
// Botones
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Botón Primario
</button>

<button className="bg-secondary-500 hover:bg-secondary-600 text-white">
  Botón Secundario
</button>

// Estados
<div className="text-success-500">Operación exitosa</div>
<div className="text-warning-500">Advertencia</div>
<div className="text-error-500">Error</div>
```

## 📝 Tipografía

### Jerarquía de Fuentes

```css
/* Títulos */
h1 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.5; }
h5 { font-size: 1.125rem; font-weight: 600; line-height: 1.5; }
h6 { font-size: 1rem; font-weight: 600; line-height: 1.5; }

/* Texto */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
```

### Clases de Tailwind

```jsx
// Títulos
<h1 className="text-4xl font-bold text-gray-900">Título Principal</h1>
<h2 className="text-3xl font-semibold text-gray-800">Subtítulo</h2>
<h3 className="text-2xl font-semibold text-gray-700">Sección</h3>

// Texto
<p className="text-base text-gray-600 leading-relaxed">
  Párrafo de texto normal
</p>
<p className="text-sm text-gray-500">
  Texto pequeño para información secundaria
</p>
```

## 📏 Espaciado

### Sistema de Espaciado

```css
/* Espaciado base (8px grid) */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### Uso en Componentes

```jsx
// Contenedores
<div className="p-4">Padding en todos los lados</div>
<div className="px-6 py-4">Padding horizontal y vertical</div>
<div className="m-4">Margin en todos los lados</div>

// Espaciado entre elementos
<div className="space-y-4">
  <div>Elemento 1</div>
  <div>Elemento 2</div>
  <div>Elemento 3</div>
</div>

// Grid con espaciado
<div className="grid grid-cols-3 gap-6">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>
```

## 🧩 Componentes

### Botones

```jsx
// Variantes de botones
<Button variant="primary" size="md">
  Botón Primario
</Button>

<Button variant="secondary" size="sm">
  Botón Secundario
</Button>

<Button variant="danger" disabled>
  Eliminar
</Button>

<Button variant="ghost" loading>
  Guardando...
</Button>
```

### Formularios

```jsx
// Campos de entrada
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Nombre
  </label>
  <input 
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    placeholder="Ingrese su nombre"
  />
</div>

// Select
<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
  <option>Seleccione una opción</option>
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
```

### Modales

```jsx
// Modal básico
<Modal isOpen={isOpen} onClose={onClose} title="Título del Modal">
  <div className="p-6">
    <p>Contenido del modal</p>
  </div>
  <div className="flex justify-end space-x-3 p-6 border-t">
    <Button variant="secondary" onClick={onClose}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Confirmar
    </Button>
  </div>
</Modal>
```

### Tablas

```jsx
// Tabla básica
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Nombre
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Email
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Rol
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        Juan Pérez
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        juan@ejemplo.com
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Admin
      </td>
    </tr>
  </tbody>
</table>
```

## 🎯 Iconografía

### Lucide React

```jsx
import { 
  User, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';

// Uso de iconos
<button className="flex items-center space-x-2">
  <User className="w-4 h-4" />
  <span>Perfil</span>
</button>

// Iconos con diferentes tamaños
<Plus className="w-5 h-5" />      {/* Pequeño */}
<Settings className="w-6 h-6" />  {/* Mediano */}
<Search className="w-8 h-8" />    {/* Grande */}
```

### Estados de Iconos

```jsx
// Iconos con colores
<User className="w-5 h-5 text-primary-500" />
<Edit className="w-5 h-5 text-warning-500" />
<Trash2 className="w-5 h-5 text-error-500" />

// Iconos con hover
<button className="hover:text-primary-500 transition-colors">
  <Settings className="w-5 h-5" />
</button>
```

## ✨ Animaciones

### Transiciones Básicas

```css
/* Transiciones suaves */
.transition-all { transition: all 0.2s ease-in-out; }
.transition-colors { transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out; }
.transition-opacity { transition: opacity 0.2s ease-in-out; }
.transition-transform { transition: transform 0.2s ease-in-out; }
```

### Framer Motion

```jsx
import { motion } from 'framer-motion';

// Animación de entrada
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Contenido animado
</motion.div>

// Animación de hover
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Botón animado
</motion.button>

// Lista animada
<motion.ul>
  {items.map((item, index) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

## 📱 Responsive Design

### Breakpoints

```css
/* Breakpoints de Tailwind */
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Clases Responsive

```jsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>

// Texto responsive
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Título Responsive
</h1>

// Espaciado responsive
<div className="p-4 md:p-6 lg:p-8">
  Contenido con padding responsive
</div>

// Navegación responsive
<nav className="hidden md:flex">
  <a href="/dashboard">Dashboard</a>
  <a href="/estudiantes">Estudiantes</a>
</nav>

<button className="md:hidden">
  <Menu className="w-6 h-6" />
</button>
```

## ♿ Accesibilidad

### ARIA Labels

```jsx
// Botones con aria-label
<button aria-label="Cerrar modal" onClick={onClose}>
  <X className="w-5 h-5" />
</button>

// Imágenes con alt text
<img 
  src="/logo.png" 
  alt="Logo de SIGO" 
  className="w-32 h-12"
/>

// Formularios accesibles
<form>
  <label htmlFor="email" className="block text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-describedby="email-help"
    className="mt-1 block w-full"
  />
  <p id="email-help" className="text-sm text-gray-500">
    Ingrese su dirección de email
  </p>
</form>
```

### Estados de Foco

```jsx
// Botones con focus visible
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Botón accesible
</button>

// Enlaces con focus
<a 
  href="/dashboard"
  className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
>
  Dashboard
</a>
```

### Contraste de Colores

```jsx
// Texto con buen contraste
<p className="text-gray-900 bg-white">Texto oscuro sobre fondo claro</p>
<p className="text-white bg-gray-900">Texto claro sobre fondo oscuro</p>

// Estados de error accesibles
<div className="text-error-500 bg-error-50 border border-error-200 p-4 rounded">
  <p className="font-medium">Error</p>
  <p>Descripción del error</p>
</div>
```

## 📋 Checklist de Implementación

### Antes de Crear un Componente

- [ ] ¿Existe un componente similar que pueda reutilizar?
- [ ] ¿El componente sigue las convenciones de nomenclatura?
- [ ] ¿Tiene documentación JSDoc?
- [ ] ¿Es responsive?
- [ ] ¿Es accesible?
- [ ] ¿Tiene estados de hover/focus?
- [ ] ¿Maneja errores apropiadamente?

### Antes de Deploy

- [ ] ¿Todos los componentes usan la paleta de colores correcta?
- [ ] ¿Las animaciones son suaves y no intrusivas?
- [ ] ¿El contraste de colores cumple con WCAG?
- [ ] ¿Los iconos tienen aria-labels cuando es necesario?
- [ ] ¿Los formularios tienen labels apropiados?
- [ ] ¿El responsive design funciona en todos los breakpoints?

---

**Última actualización:** Junio 2024  
**Versión:** 1.0.0 