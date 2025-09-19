import axios from 'axios';

/**
 * Configuración base de la instancia de Axios para la API SIGO
 * Optimizada para mejor rendimiento
 * 
 * @type {import('axios').AxiosInstance}
 */
// Detectar si estamos en red local y ajustar la URL de la API
const getApiBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) return envURL;
  
  // Si estamos accediendo desde IP de red local, usar la misma IP para la API
  if (window.location.hostname === '192.168.18.10') {
    return 'http://192.168.18.10:3001/api';
  }
  
  // Por defecto usar localhost
  return 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 5000, // Reducido de 10s a 5s
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para agregar el token JWT a todas las requests
 * Se ejecuta automáticamente antes de cada petición HTTP
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor para manejar respuestas y errores globalmente
 * Se ejecuta automáticamente después de cada respuesta HTTP
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      // Manejo específico para rate limiting
      console.warn('⚠️ Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.');
    }
    return Promise.reject(error);
  }
);

/**
 * Servicios de autenticación
 */
export const authService = {
  /**
   * Inicia sesión de un usuario
   * 
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta con token y datos del usuario
   * 
   * @example
   * ```javascript
   * const response = await authService.login({
   *   email: 'usuario@ejemplo.com',
   *   password: 'contraseña123'
   * });
   * console.log(response.data.token);
   * ```
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * Solicita código de recuperación de contraseña
   * 
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  /**
   * Verifica código y actualiza contraseña
   * 
   * @param {Object} data - Datos para reset de contraseña
   * @param {string} data.email - Email del usuario
   * @param {string} data.codigo - Código de verificación
   * @param {string} data.password - Nueva contraseña
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  resetPassword: (data) => api.post('/auth/verificar-codigo', data),
};

/**
 * Servicios de estudiantes
 */
export const estudianteService = {
  /**
   * Obtiene todos los estudiantes
   * 
   * @param {Object} [params] - Parámetros de consulta
   * @param {number} [params.page=1] - Número de página
   * @param {number} [params.limit=10] - Elementos por página
   * @param {string} [params.search] - Término de búsqueda
   * @returns {Promise<Object>} Lista de estudiantes paginada
   * 
   * @example
   * ```javascript
   * const estudiantes = await estudianteService.getAll({
   *   page: 1,
   *   limit: 20,
   *   search: 'Juan'
   * });
   * ```
   */
  getAll: (params) => api.get('/estudiantes', { params }),
  
  /**
   * Obtiene un estudiante por ID
   * 
   * @param {number} id - ID del estudiante
   * @returns {Promise<Object>} Datos del estudiante
   */
  getById: (id) => api.get(`/estudiantes/${id}`),
  
  /**
   * Crea un nuevo estudiante
   * 
   * @param {Object} estudiante - Datos del estudiante
   * @param {string} estudiante.nombre - Nombre del estudiante
   * @param {string} estudiante.apellido - Apellido del estudiante
   * @param {string} estudiante.rut - RUT del estudiante
   * @param {string} [estudiante.email] - Email del estudiante
   * @param {string} [estudiante.telefono] - Teléfono del estudiante
   * @param {string} estudiante.direccion - Dirección del estudiante
   * @param {string} estudiante.fecha_nacimiento - Fecha de nacimiento
   * @param {string} [estudiante.curso] - Curso del estudiante
   * @param {string} [estudiante.especialidad] - Especialidad del estudiante
   * @param {string} [estudiante.situacion_economica] - Situación económica
   * @returns {Promise<Object>} Estudiante creado
   */
  create: (estudiante) => api.post('/estudiantes', estudiante),
  
  /**
   * Actualiza un estudiante existente
   * 
   * @param {number} id - ID del estudiante
   * @param {Object} estudiante - Datos actualizados del estudiante
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  update: (id, estudiante) => api.put(`/estudiantes/${id}`, estudiante),
  
  /**
   * Elimina un estudiante
   * 
   * @param {number} id - ID del estudiante
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: (id) => api.delete(`/estudiantes/${id}`),
  
  /**
   * Carga masiva de estudiantes
   * 
   * @param {Array<Object>} estudiantes - Array de estudiantes
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  createBulk: (estudiantes) => api.post('/estudiantes/masivo', estudiantes),
};

/**
 * Servicios de recursos
 */
export const recursoService = {
  /**
   * Obtiene todos los recursos
   * 
   * @param {Object} [params] - Parámetros de consulta
   * @returns {Promise<Object>} Lista de recursos
   */
  getAll: (params) => api.get('/recursos', { params }),
  
  /**
   * Obtiene un recurso por ID
   * 
   * @param {number} id - ID del recurso
   * @returns {Promise<Object>} Datos del recurso
   */
  getById: (id) => api.get(`/recursos/${id}`),
  
  /**
   * Crea un nuevo recurso
   * 
   * @param {Object} recurso - Datos del recurso
   * @returns {Promise<Object>} Recurso creado
   */
  create: (recurso) => api.post('/recursos', recurso),
  
  /**
   * Actualiza un recurso existente
   * 
   * @param {number} id - ID del recurso
   * @param {Object} recurso - Datos actualizados del recurso
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  update: (id, recurso) => api.put(`/recursos/${id}`, recurso),
  
  /**
   * Elimina un recurso
   * 
   * @param {number} id - ID del recurso
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: (id) => api.delete(`/recursos/${id}`),
};

/**
 * Servicios de reportes
 */
export const reporteService = {
  /**
   * Obtiene estadísticas del dashboard
   * 
   * @returns {Promise<Object>} Estadísticas generales
   */
  getDashboardStats: () => api.get('/reportes/dashboard'),
  
  /**
   * Obtiene reporte de estudiantes
   * 
   * @param {Object} [params] - Parámetros del reporte
   * @returns {Promise<Object>} Datos del reporte
   */
  getEstudiantesReport: (params) => api.get('/reportes/estudiantes', { params }),
  
  /**
   * Obtiene reporte de recursos
   * 
   * @param {Object} [params] - Parámetros del reporte
   * @returns {Promise<Object>} Datos del reporte
   */
  getRecursosReport: (params) => api.get('/reportes/recursos', { params }),
};

/**
 * Servicios de agenda
 */
export const agendaService = {
  /**
   * Obtiene todas las citas de la agenda
   * 
   * @returns {Promise<Object>} Lista de citas
   */
  getAll: () => api.get('/agenda'),
  
  /**
   * Crea una nueva cita
   * 
   * @param {Object} cita - Datos de la cita
   * @returns {Promise<Object>} Cita creada
   */
  create: (cita) => api.post('/agenda', cita),
  
  /**
   * Actualiza una cita existente
   * 
   * @param {number} id - ID de la cita
   * @param {Object} cita - Datos actualizados de la cita
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  update: (id, cita) => api.put(`/agenda/${id}`, cita),
  
  /**
   * Elimina una cita
   * 
   * @param {number} id - ID de la cita
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: (id) => api.delete(`/agenda/${id}`),
};

export default api;
