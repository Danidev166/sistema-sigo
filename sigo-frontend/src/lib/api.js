// src/lib/api.js
import axios from 'axios';

const resolveBaseURL = () => {
  const v = import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim();
  if (v) return v;                 // puede ser '/api' (proxy SWA) o 'https://.../api'
  if (import.meta.env.PROD) return 'https://sistema-sigo.onrender.com/api'; // prod sin var => usa backend de Render
  return 'http://localhost:3001/api';      // dev
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 10000,
  transitional: { clarifyTimeoutError: true },
});

// Helpers token
const getToken = () => localStorage.getItem('token');
export const setAuthToken = (t) => localStorage.setItem('token', t);
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Interceptores
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error.response?.status;
    const original = error.config ?? {};
    const retriable = !status || status === 429 || status >= 500;

    original.__retryCount = original.__retryCount || 0;
    if (retriable && original.__retryCount < 2) {
      original.__retryCount += 1;
      const delay = 300 * Math.pow(2, original.__retryCount - 1);
      await new Promise((r) => setTimeout(r, delay));
      return api(original);
    }

    if (status === 401) {
      clearAuthToken();
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }

    return Promise.reject({
      status,
      code: error.code,
      message: error.response?.data?.message || error.message || 'Error de red',
      data: error.response?.data,
    });
  }
);

if (import.meta.env.DEV) console.log('[API] baseURL =>', api.defaults.baseURL);

export const API_BASE_URL = api.defaults.baseURL;
export default api;
