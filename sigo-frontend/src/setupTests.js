// src/setupTests.js

// Extensión de jest-dom
import '@testing-library/jest-dom';

// Importaciones de Vitest
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// 🚀 Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// 🚀 Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// 🚀 Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 🚀 Mock de ResizeObserver (para Recharts y cualquier gráfico)
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
