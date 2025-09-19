# Guía de Estudio Backend SIGO

## 1. Arquitectura General

- **Patrón MVC**: Separación en Modelos (acceso a datos), Controladores (lógica de negocio), Rutas (endpoints), Middlewares (funciones intermedias), Validadores (Joi), y Utilidades (logger, email, etc).
- **Flujo de Request**: Cliente → Express App → Middlewares → Rutas → Validación → Controlador → Modelo → Base de Datos → Respuesta.

## 2. Tecnologías Principales

- **Express.js**: Framework web para Node.js, modulariza rutas y middlewares.
- **SQL Server**: Base de datos relacional, acceso mediante `mssql` y pool de conexiones.
- **JWT**: Autenticación stateless, tokens firmados y verificados en cada request.
- **Joi**: Validación robusta de datos de entrada.
- **Winston**: Logging estructurado, logs en consola y archivos.
- **Nodemailer**: Envío de emails (notificaciones, recuperación de contraseña).
- **Swagger**: Documentación interactiva de la API.
- **Bcrypt**: Hashing seguro de contraseñas.
- **Helmet**: Headers de seguridad HTTP.
- **Morgan**: Logging de requests HTTP.
- **CORS**: Permite requests cross-origin.
- **Compression**: Compresión de respuestas HTTP.

## 3. Configuración y Setup

- Variables de entorno en `.env` para BD, JWT, email, puerto, etc.
- `index.js` configura middlewares, rutas, Swagger, healthcheck, y error handler.

## 4. Base de Datos

- Pool de conexiones para eficiencia.
- Queries parametrizadas para evitar SQL Injection.
- Tipos de datos SQL Server: `NVarChar`, `Int`, `Date`, `DateTime`, `Bit`.

## 5. Autenticación y Seguridad

- **Login**: Verifica usuario y password (bcrypt), genera JWT.
- **Recuperación de contraseña**: Token de reset y código de 6 dígitos, enviados por email.
- **Middleware verifyToken**: Verifica JWT en headers y añade usuario a `req.user`.
- **Helmet y CORS**: Seguridad en headers y control de orígenes.
- **Password hashing**: Siempre con bcrypt.

## 6. Validación de Datos

- Joi valida tipos, requeridos, longitudes, emails, etc.
- Middleware `validateBody` aplica el esquema Joi y retorna errores claros.

## 7. Logging

- Winston con niveles (`error`, `warn`, `info`, `debug`).
- Logs en consola y archivos (`error.log`, `combined.log`).

## 8. Email

- Nodemailer para notificaciones y recuperación.
- Simulación en desarrollo, real en producción.
- Templates HTML para emails.

## 9. Rutas y Controladores

- Rutas modulares, cargadas dinámicamente.
- Controladores como clases estáticas, manejo de errores con try/catch y logger.
- Respuestas HTTP claras y consistentes.

## 10. Documentación API

- Swagger/OpenAPI, modular por archivo.
- UI interactiva en `/api/docs`.
- Ejemplos de requests y responses.

## 11. Manejo de Errores

- Middleware global de errores.
- Logging de errores.
- Respuestas con status y mensaje.

## 12. Patrones de Diseño

- MVC, Repository, Middleware, Factory, Singleton.

## 13. Optimización

- Pool de conexiones, compresión, paginación, headers de cache.

## 14. Preguntas Típicas de Examen

1. ¿Cómo funciona JWT?
2. ¿Qué es MVC?
3. ¿Cómo se previene SQL Injection?
4. ¿Qué es un middleware?
5. ¿Cómo se valida la entrada?
6. ¿Qué es un connection pool?
7. ¿Cómo se maneja el logging?
8. ¿Qué medidas de seguridad hay?
9. ¿Cómo funciona Swagger?
10. ¿Qué patrones de diseño se usan?

---

**¡Éxito en tu examen!** 