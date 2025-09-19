# 🎓 SIGO Frontend - Sistema Integral de Gestión de Orientación Escolar

## 📋 Descripción

Frontend del Sistema Integral de Gestión de Orientación Escolar (SIGO), desarrollado con React 18, Vite y Tailwind CSS. Esta aplicación web proporciona una interfaz moderna y responsiva para la gestión completa de estudiantes, seguimiento académico, recursos y orientación vocacional.

## 🚀 Tecnologías Principales

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y servidor de desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router DOM** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para comunicación con API
- **Framer Motion** - Animaciones y transiciones
- **Recharts** - Gráficos y visualizaciones de datos
- **React Hot Toast** - Notificaciones toast
- **Lucide React** - Iconografía moderna

## 📁 Estructura del Proyecto

```
sigo-frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── layout/         # Componentes de layout
│   │   └── ui/             # Componentes de UI básicos
│   ├── features/           # Funcionalidades por módulo
│   │   ├── auth/           # Autenticación
│   │   ├── estudiantes/    # Gestión de estudiantes
│   │   ├── recursos/       # Gestión de recursos
│   │   ├── reportes/       # Reportes y estadísticas
│   │   └── ...
│   ├── pages/              # Páginas principales
│   ├── routes/             # Configuración de rutas
│   ├── context/            # Context API de React
│   ├── hooks/              # Custom hooks
│   ├── services/           # Servicios de API
│   └── styles/             # Estilos globales
├── public/                 # Archivos estáticos
└── dist/                   # Build de producción
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd sistema-sigo/sigo-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SIGO
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Testing
npm run test         # Ejecuta tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura

# Linting
npm run lint         # Ejecuta ESLint
```

## 🎨 Características Principales

### 🔐 Autenticación y Autorización
- Login con JWT
- Recuperación de contraseña
- Roles de usuario (Admin, Orientador)
- Rutas protegidas

### 👥 Gestión de Estudiantes
- CRUD completo de estudiantes
- Carga masiva de datos
- Seguimiento académico
- Historial de asistencia
- Evaluaciones vocacionales

### 📚 Gestión de Recursos
- Inventario de recursos
- Control de entregas
- Movimientos de stock
- Reportes de inventario

### 📊 Reportes y Estadísticas
- Dashboard con métricas
- Gráficos interactivos
- Exportación a PDF
- Filtros avanzados

### 📅 Agenda y Entrevistas
- Calendario de citas
- Notificaciones por email
- Seguimiento de entrevistas

## 🎯 Componentes Principales

### Layout Components
- `DashboardLayout` - Layout principal con sidebar
- `Footer` - Pie de página
- `FixedTopBar` - Barra superior fija

### UI Components
- `Button` - Botones reutilizables
- `Modal` - Modales y diálogos
- `LoadingSpinner` - Indicadores de carga
- `EstudianteSelector` - Selector de estudiantes

### Feature Components
- `EstudianteTable` - Tabla de estudiantes
- `EstudianteFormModal` - Formulario de estudiantes
- `ReporteGrafico` - Componentes de gráficos
- `AgendaFormModal` - Formulario de agenda

## 🔧 Configuración de Desarrollo

### ESLint
```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  react.configs.recommended,
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

### Tailwind CSS
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B'
      }
    }
  }
};
```

### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [react(), imagetools()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

## 🧪 Testing

### Configuración de Tests
- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Jest DOM** - Matchers adicionales

### Ejecutar Tests
```bash
npm run test              # Tests unitarios
npm run test:watch        # Tests en modo watch
npm run test:coverage     # Tests con cobertura
npm run test:ui           # UI de testing
```

## 📦 Build y Despliegue

### Build de Producción
```bash
npm run build
```

### Optimizaciones
- **Code Splitting** - Carga lazy de componentes
- **Tree Shaking** - Eliminación de código no usado
- **Image Optimization** - Optimización automática de imágenes
- **Compression** - Compresión de assets

### Despliegue
```bash
# Build para producción
npm run build

# Los archivos se generan en /dist
# Desplegar en cualquier servidor web estático
```

## 🔗 Integración con Backend

### Configuración de API
```javascript
// services/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Principales
- `/auth` - Autenticación
- `/estudiantes` - Gestión de estudiantes
- `/recursos` - Gestión de recursos
- `/reportes` - Reportes y estadísticas
- `/agenda` - Gestión de agenda

## 🎨 Guía de Estilos

### Colores
```css
/* Colores principales */
--primary: #3B82F6;    /* Azul principal */
--secondary: #64748B;  /* Gris secundario */
--success: #10B981;    /* Verde éxito */
--warning: #F59E0B;    /* Amarillo advertencia */
--error: #EF4444;      /* Rojo error */
```

### Tipografía
```css
/* Fuentes */
font-family: 'Inter', sans-serif;
font-size: 14px;       /* Base */
font-weight: 400;      /* Normal */
font-weight: 600;      /* Semi-bold */
```

### Espaciado
```css
/* Sistema de espaciado */
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
```

## 🐛 Troubleshooting

### Problemas Comunes

**Error de CORS**
```bash
# Verificar configuración del proxy en vite.config.js
proxy: {
  '/api': 'http://localhost:3001'
}
```

**Error de Build**
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

**Error de Tailwind**
```bash
# Regenerar CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal** - [Tu Nombre]
- **Diseñador UI/UX** - [Nombre del Diseñador]

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@sigo.edu
- Documentación: [Link a documentación]
- Issues: [Link a GitHub Issues]

---

**SIGO Frontend v0.1.0** - Sistema Integral de Gestión de Orientación Escolar
