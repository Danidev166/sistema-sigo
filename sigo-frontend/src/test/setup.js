import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Establecer el entorno de testing
process.env.NODE_ENV = 'test'

// Limpiar DOM y memoria antes de cada test
beforeEach(() => {
  // Limpiar DOM
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  
  // Limpiar localStorage
  localStorage.clear()
  
  // Limpiar mocks
  vi.clearAllMocks()
  
  // Forzar garbage collection si está disponible
  if (global.gc) {
    global.gc()
  }
})

// Limpiar después de cada test
afterEach(() => {
  // Limpiar DOM
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  
  // Limpiar localStorage
  localStorage.clear()
  
  // Limpiar mocks
  vi.clearAllMocks()
})

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    href: 'http://localhost:5173',
    origin: 'http://localhost:5173'
  },
  writable: true
})

// Mock matchMedia para react-hot-toast
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  },
  Toaster: () => null
}))

// Mock de console para evitar logs en tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
