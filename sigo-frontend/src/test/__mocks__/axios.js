// Mock completo de axios para pruebas
import { vi } from 'vitest';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock de la instancia de axios
const mockAxios = {
  create: vi.fn(() => mockAxios),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
};

// Mock de axios como función
const axios = vi.fn(() => mockAxios);
axios.create = vi.fn(() => mockAxios);
axios.get = vi.fn();
axios.post = vi.fn();
axios.put = vi.fn();
axios.delete = vi.fn();
axios.patch = vi.fn();
axios.interceptors = mockAxios.interceptors;
axios.defaults = mockAxios.defaults;

// Agregar métodos estáticos
Object.assign(axios, {
  isAxiosError: vi.fn(),
  all: vi.fn(),
  spread: vi.fn(),
});

export default axios;
export { mockAxios }; 