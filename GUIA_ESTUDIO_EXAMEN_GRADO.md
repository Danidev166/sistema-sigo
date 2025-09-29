# 🎓 GUÍA COMPLETA DE ESTUDIO - SISTEMA SIGO
## Examen de Grado en Informática

---

## 📋 **ÍNDICE DE CONTENIDOS**

1. [Arquitectura General del Sistema](#1-arquitectura-general-del-sistema)
2. [Tecnologías Utilizadas](#2-tecnologías-utilizadas)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Base de Datos](#4-base-de-datos)
5. [Backend (API REST)](#5-backend-api-rest)
6. [Frontend (React)](#6-frontend-react)
7. [Autenticación y Seguridad](#7-autenticación-y-seguridad)
8. [Despliegue y Producción](#8-despliegue-y-producción)
9. [Funcionalidades Principales](#9-funcionalidades-principales)
10. [Preguntas Frecuentes del Examen](#10-preguntas-frecuentes-del-examen)

---

## 1. ARQUITECTURA GENERAL DEL SISTEMA

### 🏗️ **Patrón Arquitectónico: MERN Stack (Modificado)**

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│                 │ ◄──────────────► │                 │
│   FRONTEND      │                  │   BACKEND       │
│   (React)       │                  │   (Node.js)     │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ SQL
                                              ▼
                                    ┌─────────────────┐
                                    │   BASE DE       │
                                    │   DATOS         │
                                    │   (PostgreSQL)  │
                                    └─────────────────┘
```

### 🔄 **Flujo de Datos:**
1. **Usuario** interactúa con la interfaz React
2. **Frontend** envía peticiones HTTP al backend
3. **Backend** procesa la lógica de negocio
4. **Base de datos** almacena y recupera datos
5. **Respuesta** se envía de vuelta al frontend

---

## 2. TECNOLOGÍAS UTILIZADAS

### 🎨 **FRONTEND**
- **React 18.2.0** - Biblioteca principal para UI
- **Vite 4.4.5** - Herramienta de build y desarrollo
- **React Router DOM 6.15.0** - Enrutamiento SPA
- **Tailwind CSS 3.3.3** - Framework de estilos
- **Lucide React** - Iconografía
- **React Hot Toast** - Notificaciones
- **Axios** - Cliente HTTP

### ⚙️ **BACKEND**
- **Node.js 18.18.0** - Runtime de JavaScript
- **Express.js 4.18.2** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT (jsonwebtoken)** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests

### 🗄️ **BASE DE DATOS**
- **PostgreSQL 12+** - Sistema de gestión de base de datos
- **22 tablas** principales
- **Relaciones** uno a muchos y muchos a muchos
- **Índices** para optimización de consultas

### 🚀 **DESPLIEGUE**
- **Render.com** - Plataforma de hosting
- **Docker** - Containerización
- **Git** - Control de versiones
- **Nginx** - Servidor web (en producción)

---

## 3. ESTRUCTURA DEL PROYECTO

```
sistema-sigo/
├── backend/                 # Servidor Node.js
│   ├── config/             # Configuración de BD
│   ├── controller/         # Lógica de negocio
│   ├── middleware/         # Middlewares personalizados
│   ├── models/            # Modelos de datos
│   ├── routes/            # Definición de rutas
│   ├── utils/             # Utilidades (email, logger)
│   ├── validators/        # Validación de datos
│   └── index.js           # Punto de entrada
├── sigo-frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── features/      # Módulos de funcionalidad
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios API
│   │   └── utils/         # Utilidades frontend
│   └── public/            # Archivos estáticos
└── docs/                  # Documentación
```

---

## 4. BASE DE DATOS

### 🗃️ **TABLAS PRINCIPALES**

#### **Usuarios y Autenticación**
- `usuarios` - Usuarios del sistema
- `roles` - Roles y permisos

#### **Estudiantes**
- `estudiantes` - Información de estudiantes
- `cursos` - Cursos disponibles
- `asistencia` - Registro de asistencia

#### **Seguimiento Académico**
- `seguimiento_academico` - Seguimiento de rendimiento
- `evaluaciones` - Evaluaciones y calificaciones
- `historial_academico` - Historial completo

#### **Seguimiento Psicosocial**
- `seguimiento_psicosocial` - Seguimiento emocional
- `intervenciones` - Intervenciones realizadas
- `entrevistas` - Entrevistas con estudiantes

#### **Comunicación**
- `comunicacion_familia` - Comunicación con apoderados
- `comunicacion_interna` - Comunicación interna
- `notificaciones` - Sistema de notificaciones

#### **Recursos y Gestión**
- `recursos` - Recursos disponibles
- `movimientos` - Movimientos de recursos
- `entrega_recurso` - Entregas de recursos

### 🔗 **RELACIONES CLAVE**
```sql
estudiantes (1) ──→ (N) asistencia
estudiantes (1) ──→ (N) seguimiento_academico
estudiantes (1) ──→ (N) entrevistas
usuarios (1) ──→ (N) logs_actividad
```

---

## 5. BACKEND (API REST)

### 🏗️ **ARQUITECTURA MVC**

#### **Models (Modelos)**
```javascript
// Ejemplo: estudianteModel.js
const EstudianteModel = {
  async crear(estudiante) {
    const pool = await getPool();
    // Lógica de inserción
  },
  async obtenerTodos() {
    // Lógica de consulta
  }
};
```

#### **Views (Controladores)**
```javascript
// Ejemplo: estudianteController.js
class EstudianteController {
  static async obtenerTodos(req, res, next) {
    try {
      const estudiantes = await EstudianteModel.listar();
      res.json(estudiantes);
    } catch (error) {
      next(error);
    }
  }
}
```

#### **Controllers (Rutas)**
```javascript
// Ejemplo: estudiantes.js
router.get('/', EstudianteController.obtenerTodos);
router.post('/', EstudianteController.crear);
router.put('/:id', EstudianteController.actualizar);
```

### 🔐 **MIDDLEWARES IMPLEMENTADOS**

1. **verifyToken** - Verificación de JWT
2. **validateBody** - Validación de datos de entrada
3. **errorHandler** - Manejo centralizado de errores
4. **rateLimit** - Limitación de requests
5. **cors** - Configuración CORS

### 📡 **ENDPOINTS PRINCIPALES**

```
GET    /api/estudiantes          # Listar estudiantes
POST   /api/estudiantes          # Crear estudiante
GET    /api/estudiantes/:id      # Obtener estudiante
PUT    /api/estudiantes/:id      # Actualizar estudiante
DELETE /api/estudiantes/:id      # Eliminar estudiante

GET    /api/estudiantes/apoderados    # Listar apoderados
GET    /api/estudiantes/cursos        # Listar cursos

POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/recuperar       # Recuperar contraseña
POST   /api/auth/verificar-codigo # Verificar código

GET    /api/reportes/dashboard   # Dashboard principal
GET    /api/asistencia           # Listar asistencia
POST   /api/asistencia           # Registrar asistencia
```

---

## 6. FRONTEND (React)

### ⚛️ **ARQUITECTURA DE COMPONENTES**

#### **Estructura Jerárquica**
```
App
├── Layout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
├── Pages
│   ├── Dashboard
│   ├── Estudiantes
│   │   ├── ListaEstudiantes
│   │   └── DetalleEstudiante
│   │       ├── Tabs
│   │       │   ├── Academico
│   │       │   ├── Familia
│   │       │   └── Intervenciones
│   │       └── Modals
└── Components
    ├── UI (Button, Modal, etc.)
    └── Forms
```

#### **Hooks Utilizados**
- `useState` - Estado local de componentes
- `useEffect` - Efectos secundarios
- `useCallback` - Optimización de funciones
- `useNavigate` - Navegación programática
- `useLocation` - Información de ruta actual

#### **Gestión de Estado**
```javascript
// Estado local en componentes
const [estudiantes, setEstudiantes] = useState([]);
const [loading, setLoading] = useState(true);
const [filtros, setFiltros] = useState({});

// Servicios para API
const fetchEstudiantes = async () => {
  const response = await estudianteService.obtenerTodos();
  setEstudiantes(response.data);
};
```

### 🎨 **SISTEMA DE DISEÑO**

#### **Tailwind CSS**
- **Utility-first** - Clases utilitarias
- **Responsive** - Diseño adaptativo
- **Dark mode** - Modo oscuro
- **Componentes** - Botones, modales, formularios

#### **Ejemplo de Componente**
```jsx
const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## 7. AUTENTICACIÓN Y SEGURIDAD

### 🔐 **SISTEMA JWT**

#### **Flujo de Autenticación**
1. **Login** - Usuario envía credenciales
2. **Verificación** - Backend valida usuario/contraseña
3. **Token** - Se genera JWT con datos del usuario
4. **Almacenamiento** - Token se guarda en localStorage
5. **Requests** - Token se envía en header Authorization
6. **Verificación** - Middleware verifica token en cada request

#### **Implementación**
```javascript
// Backend - Generación de token
const accessToken = jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Frontend - Envío de token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Backend - Verificación
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 🛡️ **MEDIDAS DE SEGURIDAD**

1. **Encriptación** - Contraseñas con bcrypt
2. **CORS** - Configuración de orígenes permitidos
3. **Helmet** - Headers de seguridad HTTP
4. **Rate Limiting** - Limitación de requests
5. **Validación** - Sanitización de datos de entrada
6. **HTTPS** - Comunicación encriptada

---

## 8. DESPLIEGUE Y PRODUCCIÓN

### 🚀 **PLATAFORMA: RENDER.COM**

#### **Configuración Backend**
- **Runtime**: Node.js 18.18.0
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Puerto**: 3001
- **Base de datos**: PostgreSQL externa

#### **Configuración Frontend**
- **Runtime**: Node.js 18.18.0
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Puerto**: 5173

### 🔧 **VARIABLES DE ENTORNO**

#### **Backend (.env.production)**
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=clave_super_secreta
DATABASE_URL=postgresql://user:pass@host:port/db
MAIL_HOST=smtp.gmail.com
MAIL_USER=email@gmail.com
MAIL_PASS=app_password
```

#### **Frontend (Vite)**
```env
VITE_API_URL=https://sistema-sigo.onrender.com/api
VITE_APP_NAME=SIGO
```

### 📊 **MONITOREO Y LOGS**

- **Logs de aplicación** - Morgan + Winston
- **Logs de errores** - Archivos separados
- **Métricas** - Render dashboard
- **Uptime** - Monitoreo automático

---

## 9. FUNCIONALIDADES PRINCIPALES

### 👥 **GESTIÓN DE ESTUDIANTES**
- **CRUD completo** - Crear, leer, actualizar, eliminar
- **Búsqueda y filtros** - Por nombre, curso, RUT
- **Información completa** - Datos personales, académicos, familiares
- **Fotos de perfil** - Gestión de imágenes

### 📊 **DASHBOARD Y REPORTES**
- **Estadísticas en tiempo real** - Contadores dinámicos
- **Gráficos interactivos** - Charts.js
- **Filtros por fecha** - Períodos personalizables
- **Exportación** - PDF, Excel

### 📅 **SISTEMA DE ASISTENCIA**
- **Registro diario** - Marcar presente/ausente
- **Estadísticas** - Porcentajes de asistencia
- **Alertas** - Estudiantes con baja asistencia
- **Reportes** - Generación automática

### 🎯 **SEGUIMIENTO ACADÉMICO**
- **Evaluaciones** - Registro de calificaciones
- **Historial** - Evolución del rendimiento
- **Alertas** - Estudiantes en riesgo
- **Intervenciones** - Planes de apoyo

### 👨‍👩‍👧‍👦 **COMUNICACIÓN FAMILIAR**
- **Lista de apoderados** - Con filtros y paginación
- **Envío de emails** - Comunicaciones masivas
- **Historial** - Registro de comunicaciones
- **Templates** - Plantillas predefinidas

### 📚 **GESTIÓN DE RECURSOS**
- **Inventario** - Control de recursos
- **Movimientos** - Entrada y salida
- **Asignaciones** - Recursos por estudiante
- **Alertas** - Stock bajo

---

## 10. PREGUNTAS FRECUENTES DEL EXAMEN

### ❓ **PREGUNTAS TÉCNICAS**

#### **1. ¿Por qué elegiste React para el frontend?**
- **Componentes reutilizables** - Facilita mantenimiento
- **Virtual DOM** - Mejor rendimiento
- **Ecosistema maduro** - Muchas librerías disponibles
- **Hooks** - Gestión de estado simplificada
- **JSX** - Sintaxis intuitiva

#### **2. ¿Por qué PostgreSQL sobre MySQL?**
- **ACID completo** - Transacciones robustas
- **Tipos de datos avanzados** - JSON, arrays, etc.
- **Índices avanzados** - Mejor rendimiento
- **Open source** - Sin restricciones de licencia
- **Escalabilidad** - Manejo de grandes volúmenes

#### **3. ¿Cómo manejas la seguridad en la aplicación?**
- **JWT** - Tokens seguros para autenticación
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Control de orígenes
- **Helmet** - Headers de seguridad
- **Validación** - Sanitización de inputs
- **Rate limiting** - Prevención de ataques

#### **4. ¿Cuál es la arquitectura del sistema?**
- **MVC** - Modelo-Vista-Controlador
- **API REST** - Comunicación frontend-backend
- **SPA** - Single Page Application
- **Microservicios** - Separación de responsabilidades
- **Stateless** - Backend sin estado

#### **5. ¿Cómo optimizas el rendimiento?**
- **Paginación** - Carga de datos por lotes
- **Índices de BD** - Consultas optimizadas
- **Lazy loading** - Carga bajo demanda
- **Caching** - Almacenamiento temporal
- **Compresión** - Gzip en servidor

### ❓ **PREGUNTAS DE NEGOCIO**

#### **1. ¿Qué problema resuelve el sistema?**
- **Gestión integral** - Centraliza información estudiantil
- **Seguimiento** - Monitoreo académico y psicosocial
- **Comunicación** - Conexión con familias
- **Reportes** - Análisis de datos
- **Eficiencia** - Automatización de procesos

#### **2. ¿Quiénes son los usuarios del sistema?**
- **Orientadores** - Gestión de estudiantes
- **Profesores** - Registro de asistencia
- **Administradores** - Configuración del sistema
- **Apoderados** - Consulta de información (futuro)

#### **3. ¿Cuáles son los módulos principales?**
- **Dashboard** - Vista general del sistema
- **Estudiantes** - Gestión de alumnos
- **Asistencia** - Control de presencia
- **Seguimiento** - Monitoreo académico
- **Comunicación** - Contacto con familias
- **Recursos** - Gestión de materiales

### ❓ **PREGUNTAS DE IMPLEMENTACIÓN**

#### **1. ¿Cómo manejas los errores?**
- **Try-catch** - Captura de errores
- **Middleware** - Manejo centralizado
- **Logs** - Registro de errores
- **Respuestas HTTP** - Códigos apropiados
- **Frontend** - Notificaciones al usuario

#### **2. ¿Cómo implementas la paginación?**
- **Backend** - LIMIT y OFFSET en SQL
- **Frontend** - Estado de página actual
- **UI** - Botones anterior/siguiente
- **API** - Parámetros limit y offset

#### **3. ¿Cómo manejas el estado en React?**
- **useState** - Estado local
- **useEffect** - Efectos secundarios
- **Props** - Comunicación entre componentes
- **Context** - Estado global (si es necesario)

---

## 🎯 **CONSEJOS PARA EL EXAMEN**

### 📚 **PREPARACIÓN**
1. **Practica explicando** cada componente en voz alta
2. **Dibuja diagramas** de la arquitectura
3. **Prepara ejemplos** de código específicos
4. **Conoce los números** - 22 tablas, 6 estudiantes, etc.
5. **Entiende el flujo** completo de datos

### 💡 **DURANTE EL EXAMEN**
1. **Explica el "por qué"** no solo el "qué"
2. **Menciona alternativas** que consideraste
3. **Habla de desafíos** y cómo los resolviste
4. **Conecta con casos reales** de uso
5. **Muestra pasión** por el proyecto

### 🔥 **PUNTOS CLAVE A DESTACAR**
- **Arquitectura escalable** - Preparada para crecimiento
- **Seguridad robusta** - Múltiples capas de protección
- **UX intuitiva** - Fácil de usar para orientadores
- **Datos reales** - Sistema funcional con información real
- **Código limpio** - Buenas prácticas de desarrollo

---

## 📞 **CONTACTO Y RECURSOS**

- **Repositorio**: https://github.com/Danidev166/sistema-sigo
- **Demo**: https://sigo-caupolican.onrender.com
- **API**: https://sistema-sigo.onrender.com/api
- **Usuario prueba**: test@test.com / test123

---

**¡ÉXITO EN TU EXAMEN DE GRADO! 🎓✨**
