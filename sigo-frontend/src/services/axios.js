// src/lib/api.js (o donde tengas tu cliente HTTP)
import axios from 'axios';

/**
 * Resuelve la baseURL de la API:
 * - Si existe VITE_API_URL, la usa tal cual (puede ser '/api' o una URL completa).
 * - En producción, si no hay VITE_API_URL, usa '/api' (ideal con proxy de Static Web Apps).
 * - En desarrollo, fallback al backend local.
 */
const resolveBaseURL = () => {
  const env = import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim();
  if (env) return env;
  if (import.meta.env.PROD) return '/api';
  return 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
  transitional: { clarifyTimeoutError: true },
});

// Helpers de token
const getToken = () => localStorage.getItem('token');
export const setAuthToken = (t) => localStorage.setItem('token', t);
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Interceptor de REQUEST: agrega Authorization si hay token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE: reintentos ligeros + manejo de 401/429
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config ?? {};

    // Reintento básico para errores transitorios (red/429/5xx), máx 2 veces
    const retriable = !status || status === 429 || status >= 500;
    original.__retryCount = original.__retryCount || 0;

    if (retriable && original.__retryCount < 2) {
      original.__retryCount += 1;
      const delay = 300 * Math.pow(2, original.__retryCount - 1); // 300ms, 600ms
      await new Promise((r) => setTimeout(r, delay));
      return api(original);
    }

    // Si es 401, limpiamos sesión y vamos a /login
    if (status === 401) {
      clearAuthToken();
      if (!location.pathname.startsWith('/login')) {
        location.href = '/login';
      }
    }

    // Normaliza el error que llega al caller
    const normalized = {
      status,
      code: error.code,
      message:
        error.response?.data?.message ||
        error.message ||
        'Error de red. Intenta nuevamente.',
      data: error.response?.data,
    };

    return Promise.reject(normalized);
  }
);

if (import.meta.env.DEV) {
  // Útil para comprobar qué baseURL quedó activa
  // eslint-disable-next-line no-console
  console.log('[API] baseURL =>', api.defaults.baseURL);
}

export const API_BASE_URL = api.defaults.baseURL;
export default api;
