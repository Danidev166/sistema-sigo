# 📚 PAUTA DE ESTUDIO COMPLETA - SISTEMA SIGO
## Guía Integral para Dominar el Sistema de Gestión Estudiantil

---

## 🎯 **OBJETIVO DE ESTUDIO**

Esta pauta te ayudará a dominar completamente el Sistema SIGO, desde sus fundamentos técnicos hasta las mejores prácticas de implementación. Está diseñada para que puedas explicar cada aspecto del sistema con confianza y profundidad.

---

## 📋 **ÍNDICE DE CONTENIDOS**

1. [Fundamentos del Sistema](#1-fundamentos-del-sistema)
2. [Arquitectura y Diseño](#2-arquitectura-y-diseño)
3. [Tecnologías Frontend](#3-tecnologías-frontend)
4. [Tecnologías Backend](#4-tecnologías-backend)
5. [Base de Datos](#5-base-de-datos)
6. [Seguridad y Autenticación](#6-seguridad-y-autenticación)
7. [Despliegue y Producción](#7-despliegue-y-producción)
8. [Funcionalidades del Sistema](#8-funcionalidades-del-sistema)
9. [Glosario Técnico](#9-glosario-técnico)
10. [Preguntas de Examen](#10-preguntas-de-examen)

---

## 1. FUNDAMENTOS DEL SISTEMA

### 🎯 **¿Qué es SIGO?**

SIGO (Sistema Integral de Gestión de Orientación) es una aplicación web desarrollada para centralizar la gestión estudiantil en instituciones educativas. Permite a orientadores, profesores y administradores gestionar información académica, psicosocial y comunicacional de los estudiantes.

### 🎯 **Problema que Resuelve**

- **Dispersión de información**: Antes, los datos estaban en diferentes lugares
- **Falta de seguimiento**: No había un sistema centralizado de monitoreo
- **Comunicación limitada**: Dificultad para contactar con apoderados
- **Reportes manuales**: Generación de estadísticas de forma manual
- **Pérdida de tiempo**: Búsqueda de información en múltiples fuentes

### 🎯 **Beneficios del Sistema**

- **Centralización**: Toda la información en un solo lugar
- **Automatización**: Procesos automáticos de reportes y alertas
- **Comunicación**: Envío directo de emails a apoderados
- **Seguimiento**: Monitoreo continuo del progreso estudiantil
- **Eficiencia**: Reducción del tiempo en tareas administrativas

---

## 2. ARQUITECTURA Y DISEÑO

### 🏗️ **Patrón Arquitectónico: MVC + API REST**

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   FRONTEND      │ ◄──────────────► │   BACKEND       │
│   (React SPA)   │                  │   (Node.js)     │
│                 │                  │                 │
│ ┌─────────────┐ │                  │ ┌─────────────┐ │
│ │ Components  │ │                  │ │ Controllers │ │
│ │ - Dashboard │ │                  │ │ - Auth      │ │
│ │ - Students  │ │                  │ │ - Students  │ │
│ │ - Reports   │ │                  │ │ - Reports   │ │
│ └─────────────┘ │                  │ └─────────────┘ │
│                 │                  │                 │
│ ┌─────────────┐ │                  │ ┌─────────────┐ │
│ │ Services    │ │                  │ │ Models      │ │
│ │ - API calls │ │                  │ │ - Database  │ │
│ │ - Auth      │ │                  │ │ - Business  │ │
│ │ - Utils     │ │                  │ │ - Logic     │ │
│ └─────────────┘ │                  │ └─────────────┘ │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ SQL Queries
                                              ▼
                                    ┌─────────────────┐
                                    │   POSTGRESQL    │
                                    │   DATABASE      │
                                    └─────────────────┘
```

### 🔄 **Flujo de Datos**

1. **Usuario** interactúa con la interfaz React
2. **Frontend** envía peticiones HTTP al backend
3. **Backend** procesa la lógica de negocio
4. **Base de datos** almacena y recupera datos
5. **Respuesta** se envía de vuelta al frontend

### 🎯 **Principios de Diseño**

- **Separación de responsabilidades**: Frontend, Backend y Base de datos
- **API RESTful**: Comunicación estándar entre capas
- **Stateless**: Backend sin estado, escalable
- **Responsive**: Funciona en múltiples dispositivos
- **Modular**: Componentes reutilizables

---

## 3. TECNOLOGÍAS FRONTEND

### ⚛️ **React 18.2.0**

**¿Qué es?** Biblioteca de JavaScript para construir interfaces de usuario.

**¿Por qué React?**
- **Componentes reutilizables**: Facilita mantenimiento
- **Virtual DOM**: Mejor rendimiento
- **Ecosistema maduro**: Muchas librerías disponibles
- **Hooks**: Gestión de estado simplificada
- **JSX**: Sintaxis intuitiva

**Conceptos clave:**
```jsx
// Componente funcional con hooks
const EstudianteCard = ({ estudiante }) => {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Efectos secundarios
  }, []);
  
  return (
    <div className="card">
      <h3>{estudiante.nombre}</h3>
    </div>
  );
};
```

### 🚀 **Vite 6.3.5**

**¿Qué es?** Herramienta de build y desarrollo ultra-rápida.

**Ventajas:**
- **Hot Module Replacement (HMR)**: Cambios instantáneos
- **Build optimizado**: Bundle más pequeño
- **Desarrollo rápido**: Servidor de desarrollo veloz
- **TypeScript nativo**: Soporte completo

**Configuración:**
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
};
```

### 🎨 **Tailwind CSS 3.4.17**

**¿Qué es?** Framework de CSS utility-first.

**Ventajas:**
- **Utility-first**: Clases predefinidas
- **Responsive**: Diseño adaptativo
- **Customizable**: Configuración personalizada
- **Performance**: CSS optimizado

**Ejemplo:**
```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Botón
</button>
```

### 🛣️ **React Router DOM 6.20.0**

**¿Qué es?** Librería de enrutamiento para React.

**Características:**
- **SPA Navigation**: Navegación sin recarga
- **Nested Routes**: Rutas anidadas
- **Protected Routes**: Rutas protegidas
- **History API**: Navegación programática

**Implementación:**
```jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
</Routes>
```

### 📡 **Axios 1.6.2**

**¿Qué es?** Cliente HTTP para JavaScript.

**Características:**
- **Promises**: Manejo asíncrono
- **Interceptors**: Modificar requests/responses
- **Request/Response transformation**: Transformar datos
- **Error handling**: Manejo de errores

**Uso:**
```javascript
// Configuración base
const api = axios.create({
  baseURL: 'https://sistema-sigo.onrender.com/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Uso en componente
const fetchEstudiantes = async () => {
  try {
    const response = await api.get('/estudiantes');
    setEstudiantes(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 🎭 **Framer Motion 12.12.1**

**¿Qué es?** Librería de animaciones para React.

**Características:**
- **Declarative**: Animaciones declarativas
- **Performance**: Optimizado para 60fps
- **Gestures**: Gestos táctiles
- **Layout animations**: Animaciones de layout

### 🔔 **React Hot Toast 2.5.2**

**¿Qué es?** Sistema de notificaciones toast.

**Características:**
- **Lightweight**: Poco peso
- **Customizable**: Personalizable
- **Accessible**: Accesible
- **Promise support**: Soporte para promesas

---

## 4. TECNOLOGÍAS BACKEND

### 🟢 **Node.js 18.18.0**

**¿Qué es?** Runtime de JavaScript para el servidor.

**Ventajas:**
- **JavaScript everywhere**: Mismo lenguaje frontend/backend
- **Non-blocking I/O**: Operaciones asíncronas
- **NPM ecosystem**: Gran ecosistema de paquetes
- **Performance**: Alto rendimiento

**Características:**
- **Event Loop**: Manejo asíncrono
- **Modules**: Sistema de módulos
- **Streams**: Flujo de datos
- **Cluster**: Escalabilidad

### 🚀 **Express.js 5.1.0**

**¿Qué es?** Framework web minimalista para Node.js.

**Características:**
- **Middleware**: Funciones intermedias
- **Routing**: Sistema de rutas
- **Templates**: Motor de plantillas
- **Static files**: Servir archivos estáticos

**Estructura básica:**
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.get('/api/estudiantes', (req, res) => {
  res.json(estudiantes);
});

app.listen(3001, () => {
  console.log('Servidor corriendo en puerto 3001');
});
```

### 🗄️ **PostgreSQL**

**¿Qué es?** Sistema de gestión de base de datos relacional.

**Ventajas sobre MySQL:**
- **ACID completo**: Transacciones robustas
- **Tipos avanzados**: JSON, arrays, etc.
- **Índices avanzados**: Mejor rendimiento
- **Open source**: Sin restricciones
- **Escalabilidad**: Manejo de grandes volúmenes

**Características:**
- **Relational**: Base de datos relacional
- **ACID**: Atomicidad, Consistencia, Aislamiento, Durabilidad
- **SQL**: Lenguaje estándar
- **Extensions**: Extensiones disponibles

### 🔐 **JWT (jsonwebtoken 9.0.2)**

**¿Qué es?** Estándar para tokens de autenticación.

**Ventajas:**
- **Stateless**: Sin estado en servidor
- **Scalable**: Escalable horizontalmente
- **Self-contained**: Información en el token
- **Cross-domain**: Funciona entre dominios

**Implementación:**
```javascript
// Generar token
const token = jwt.sign(
  { id: usuario.id, email: usuario.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 🔒 **bcrypt 6.0.0**

**¿Qué es?** Librería para encriptar contraseñas.

**Características:**
- **Salt rounds**: Rondas de sal
- **One-way**: Encriptación irreversible
- **Secure**: Seguro contra ataques
- **Slow**: Resistente a fuerza bruta

**Uso:**
```javascript
// Encriptar contraseña
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar contraseña
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 📧 **Nodemailer 7.0.3**

**¿Qué es?** Librería para envío de emails.

**Características:**
- **SMTP**: Protocolo estándar
- **Templates**: Plantillas de email
- **Attachments**: Archivos adjuntos
- **Multiple providers**: Múltiples proveedores

### 🛡️ **Helmet 8.1.0**

**¿Qué es?** Middleware de seguridad para Express.

**Protecciones:**
- **XSS**: Cross-site scripting
- **CSRF**: Cross-site request forgery
- **Clickjacking**: Protección contra clickjacking
- **HSTS**: HTTP Strict Transport Security

### 📊 **Morgan 1.10.0**

**¿Qué es?** Middleware de logging para Express.

**Características:**
- **HTTP logging**: Log de requests HTTP
- **Custom formats**: Formatos personalizados
- **Streams**: Flujo de logs
- **Performance**: Bajo impacto

---

## 5. BASE DE DATOS

### 🗃️ **Estructura de Tablas (22 tablas principales)**

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

### 🔗 **Relaciones Clave**

```sql
-- Relaciones principales
estudiantes (1) ──→ (N) asistencia
estudiantes (1) ──→ (N) seguimiento_academico
estudiantes (1) ──→ (N) entrevistas
usuarios (1) ──→ (N) logs_actividad
```

### 📊 **Índices para Optimización**

```sql
-- Índices principales
CREATE INDEX idx_estudiantes_rut ON estudiantes(rut);
CREATE INDEX idx_asistencia_fecha ON asistencia(fecha);
CREATE INDEX idx_entrevistas_estudiante ON entrevistas(id_estudiante);
```

---

## 6. SEGURIDAD Y AUTENTICACIÓN

### 🔐 **Sistema JWT**

**Flujo de Autenticación:**
1. **Login** - Usuario envía credenciales
2. **Verificación** - Backend valida usuario/contraseña
3. **Token** - Se genera JWT con datos del usuario
4. **Almacenamiento** - Token se guarda en localStorage
5. **Requests** - Token se envía en header Authorization
6. **Verificación** - Middleware verifica token en cada request

### 🛡️ **Medidas de Seguridad**

1. **Encriptación** - Contraseñas con bcrypt
2. **CORS** - Configuración de orígenes permitidos
3. **Helmet** - Headers de seguridad HTTP
4. **Rate Limiting** - Limitación de requests
5. **Validación** - Sanitización de datos de entrada
6. **HTTPS** - Comunicación encriptada

### 🔒 **Middleware de Seguridad**

```javascript
// Verificación de token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

---

## 7. DESPLIEGUE Y PRODUCCIÓN

### 🚀 **Plataforma: Render.com**

**Ventajas:**
- **Git-based deployment**: Despliegue automático
- **Auto-scaling**: Escalado automático
- **SSL certificates**: Certificados SSL gratuitos
- **Environment variables**: Variables de entorno
- **Logs**: Sistema de logs integrado

### 🐳 **Docker**

**¿Qué es?** Plataforma de containerización.

**Ventajas:**
- **Consistency**: Entorno consistente
- **Portability**: Portabilidad entre sistemas
- **Isolation**: Aislamiento de aplicaciones
- **Scalability**: Escalabilidad

### 🔧 **Variables de Entorno**

```env
# Backend
NODE_ENV=production
PORT=3001
JWT_SECRET=clave_super_secreta
DATABASE_URL=postgresql://user:pass@host:port/db
MAIL_HOST=smtp.gmail.com
MAIL_USER=email@gmail.com
MAIL_PASS=app_password

# Frontend
VITE_API_URL=https://sistema-sigo.onrender.com/api
VITE_APP_NAME=SIGO
```

---

## 8. FUNCIONALIDADES DEL SISTEMA

### 👥 **Gestión de Estudiantes**

**CRUD Completo:**
- **Create**: Crear nuevos estudiantes
- **Read**: Leer información de estudiantes
- **Update**: Actualizar datos
- **Delete**: Eliminar estudiantes

**Características:**
- **Búsqueda**: Por nombre, RUT, curso
- **Filtros**: Múltiples criterios
- **Paginación**: Carga por lotes
- **Validación**: Datos consistentes

### 📊 **Dashboard y Reportes**

**Estadísticas en Tiempo Real:**
- **Contadores**: Número de estudiantes, entrevistas, etc.
- **Gráficos**: Visualización de datos
- **Filtros**: Por fecha, curso, etc.
- **Exportación**: PDF, Excel

### 📅 **Sistema de Asistencia**

**Funcionalidades:**
- **Registro diario**: Marcar presente/ausente
- **Estadísticas**: Porcentajes de asistencia
- **Alertas**: Estudiantes con baja asistencia
- **Reportes**: Generación automática

### 🎯 **Seguimiento Académico**

**Características:**
- **Evaluaciones**: Registro de calificaciones
- **Historial**: Evolución del rendimiento
- **Alertas**: Estudiantes en riesgo
- **Intervenciones**: Planes de apoyo

### 👨‍👩‍👧‍👦 **Comunicación Familiar**

**Funcionalidades:**
- **Lista de apoderados**: Con filtros y paginación
- **Envío de emails**: Comunicaciones masivas
- **Historial**: Registro de comunicaciones
- **Templates**: Plantillas predefinidas

### 📚 **Gestión de Recursos**

**Características:**
- **Inventario**: Control de recursos
- **Movimientos**: Entrada y salida
- **Asignaciones**: Recursos por estudiante
- **Alertas**: Stock bajo

---

## 9. GLOSARIO TÉCNICO

### 🔤 **Términos Frontend**

**React**: Biblioteca de JavaScript para construir interfaces de usuario
**Componente**: Pieza reutilizable de UI
**Hook**: Función que permite usar estado y características de React
**JSX**: Extensión de sintaxis de JavaScript
**Virtual DOM**: Representación virtual del DOM real
**State**: Estado de un componente
**Props**: Propiedades que se pasan a un componente
**Effect**: Efecto secundario en un componente
**Context**: Forma de pasar datos a través del árbol de componentes
**Router**: Sistema de navegación en aplicaciones SPA

### 🔤 **Términos Backend**

**API**: Interfaz de programación de aplicaciones
**REST**: Estilo arquitectónico para servicios web
**Endpoint**: Punto de entrada de una API
**Middleware**: Función que se ejecuta entre request y response
**Controller**: Maneja la lógica de negocio
**Model**: Representa la estructura de datos
**Route**: Define las rutas de la aplicación
**Authentication**: Proceso de verificación de identidad
**Authorization**: Proceso de verificación de permisos
**JWT**: Token de autenticación estándar
**bcrypt**: Algoritmo de hash para contraseñas

### 🔤 **Términos Base de Datos**

**PostgreSQL**: Sistema de gestión de base de datos relacional
**SQL**: Lenguaje de consulta estructurado
**Table**: Estructura que almacena datos
**Column**: Campo de una tabla
**Row**: Registro de una tabla
**Primary Key**: Clave primaria única
**Foreign Key**: Clave foránea que referencia otra tabla
**Index**: Estructura que mejora la velocidad de consultas
**Query**: Consulta a la base de datos
**Transaction**: Operación atómica de base de datos
**ACID**: Propiedades de transacciones de base de datos

### 🔤 **Términos de Seguridad**

**HTTPS**: Protocolo seguro de transferencia de hipertexto
**SSL/TLS**: Protocolos de seguridad de transporte
**CORS**: Compartir recursos de origen cruzado
**XSS**: Ataque de scripts entre sitios
**CSRF**: Falsificación de solicitud entre sitios
**Rate Limiting**: Limitación de velocidad de requests
**Input Validation**: Validación de datos de entrada
**Sanitization**: Limpieza de datos de entrada
**Encryption**: Proceso de codificar información
**Hash**: Función que convierte datos en cadena de longitud fija

### 🔤 **Términos de Despliegue**

**Deployment**: Proceso de poner en producción
**CI/CD**: Integración continua y despliegue continuo
**Docker**: Plataforma de containerización
**Container**: Instancia de una imagen Docker
**Image**: Plantilla para crear contenedores
**Environment**: Entorno de ejecución
**Variables**: Variables de entorno
**Logs**: Registros de eventos del sistema
**Monitoring**: Supervisión del sistema
**Scaling**: Escalado del sistema

---

## 10. PREGUNTAS DE EXAMEN

### ❓ **Preguntas Técnicas**

#### **1. ¿Por qué elegiste React para el frontend?**
- **Componentes reutilizables**: Facilita mantenimiento
- **Virtual DOM**: Mejor rendimiento
- **Ecosistema maduro**: Muchas librerías disponibles
- **Hooks**: Gestión de estado simplificada
- **JSX**: Sintaxis intuitiva

#### **2. ¿Por qué PostgreSQL sobre MySQL?**
- **ACID completo**: Transacciones robustas
- **Tipos de datos avanzados**: JSON, arrays, etc.
- **Índices avanzados**: Mejor rendimiento
- **Open source**: Sin restricciones de licencia
- **Escalabilidad**: Manejo de grandes volúmenes

#### **3. ¿Cómo manejas la seguridad en la aplicación?**
- **JWT**: Tokens seguros para autenticación
- **bcrypt**: Encriptación de contraseñas
- **CORS**: Control de orígenes
- **Helmet**: Headers de seguridad
- **Validación**: Sanitización de inputs
- **Rate limiting**: Prevención de ataques

#### **4. ¿Cuál es la arquitectura del sistema?**
- **MVC**: Modelo-Vista-Controlador
- **API REST**: Comunicación frontend-backend
- **SPA**: Single Page Application
- **Microservicios**: Separación de responsabilidades
- **Stateless**: Backend sin estado

#### **5. ¿Cómo optimizas el rendimiento?**
- **Paginación**: Carga de datos por lotes
- **Índices de BD**: Consultas optimizadas
- **Lazy loading**: Carga bajo demanda
- **Caching**: Almacenamiento temporal
- **Compresión**: Gzip en servidor

### ❓ **Preguntas de Negocio**

#### **1. ¿Qué problema resuelve el sistema?**
- **Gestión integral**: Centraliza información estudiantil
- **Seguimiento**: Monitoreo académico y psicosocial
- **Comunicación**: Conexión con familias
- **Reportes**: Análisis de datos
- **Eficiencia**: Automatización de procesos

#### **2. ¿Quiénes son los usuarios del sistema?**
- **Orientadores**: Gestión de estudiantes
- **Profesores**: Registro de asistencia
- **Administradores**: Configuración del sistema
- **Apoderados**: Consulta de información (futuro)

#### **3. ¿Cuáles son los módulos principales?**
- **Dashboard**: Vista general del sistema
- **Estudiantes**: Gestión de alumnos
- **Asistencia**: Control de presencia
- **Seguimiento**: Monitoreo académico
- **Comunicación**: Contacto con familias
- **Recursos**: Gestión de materiales

### ❓ **Preguntas de Implementación**

#### **1. ¿Cómo manejas los errores?**
- **Try-catch**: Captura de errores
- **Middleware**: Manejo centralizado
- **Logs**: Registro de errores
- **Respuestas HTTP**: Códigos apropiados
- **Frontend**: Notificaciones al usuario

#### **2. ¿Cómo implementas la paginación?**
- **Backend**: LIMIT y OFFSET en SQL
- **Frontend**: Estado de página actual
- **UI**: Botones anterior/siguiente
- **API**: Parámetros limit y offset

#### **3. ¿Cómo manejas el estado en React?**
- **useState**: Estado local
- **useEffect**: Efectos secundarios
- **Props**: Comunicación entre componentes
- **Context**: Estado global (si es necesario)

---

## 🎯 **CONSEJOS PARA EL EXAMEN**

### 📚 **Preparación**
1. **Practica explicando** cada componente en voz alta
2. **Dibuja diagramas** de la arquitectura
3. **Prepara ejemplos** de código específicos
4. **Conoce los números** - 22 tablas, 6 estudiantes, etc.
5. **Entiende el flujo** completo de datos

### 💡 **Durante el Examen**
1. **Explica el "por qué"** no solo el "qué"
2. **Menciona alternativas** que consideraste
3. **Habla de desafíos** y cómo los resolviste
4. **Conecta con casos reales** de uso
5. **Muestra pasión** por el proyecto

### 🔥 **Puntos Clave a Destacar**
- **Arquitectura escalable**: Preparada para crecimiento
- **Seguridad robusta**: Múltiples capas de protección
- **UX intuitiva**: Fácil de usar para orientadores
- **Datos reales**: Sistema funcional con información real
- **Código limpio**: Buenas prácticas de desarrollo

---

## 📞 **Recursos y Enlaces**

- **Repositorio**: https://github.com/Danidev166/sistema-sigo
- **Demo Frontend**: https://sigo-caupolican.onrender.com
- **API Backend**: https://sistema-sigo.onrender.com/api
- **Usuario prueba**: test@test.com / test123

---

**¡ÉXITO EN TU EXAMEN DE GRADO! 🎓✨**

*Recuerda: Confianza, conocimiento técnico y pasión por el proyecto son las claves del éxito.*
