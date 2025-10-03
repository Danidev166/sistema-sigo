import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  },
  Toaster: () => null
}));

// Mock de date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('es-ES');
    }
    return new Date(date).toLocaleDateString('es-ES');
  })
}));

// Mock de recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }) => React.createElement('div', { 'data-testid': 'line-chart' }, children),
  BarChart: ({ children }) => React.createElement('div', { 'data-testid': 'bar-chart' }, children),
  PieChart: ({ children }) => React.createElement('div', { 'data-testid': 'pie-chart' }, children),
  AreaChart: ({ children }) => React.createElement('div', { 'data-testid': 'area-chart' }, children),
  Line: () => React.createElement('div', { 'data-testid': 'line' }),
  Bar: () => React.createElement('div', { 'data-testid': 'bar' }),
  Pie: () => React.createElement('div', { 'data-testid': 'pie' }),
  Area: () => React.createElement('div', { 'data-testid': 'area' }),
  XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
  CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
  Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
  Legend: () => React.createElement('div', { 'data-testid': 'legend' }),
  ResponsiveContainer: ({ children }) => React.createElement('div', { 'data-testid': 'responsive-container' }, children),
  Cell: () => React.createElement('div', { 'data-testid': 'cell' })
}));

// Mock de jsPDF
vi.mock('jspdf', () => {
  const mockPdf = {
    setFontSize: vi.fn(),
    text: vi.fn(),
    autoTable: vi.fn(),
    save: vi.fn(),
    lastAutoTable: { finalY: 100 }
  };
  return vi.fn(() => mockPdf);
});

// Mock de jspdf-autotable
vi.mock('jspdf-autotable', () => ({}));

// Mock de lodash
vi.mock('lodash', () => ({
  debounce: vi.fn((fn) => fn)
}));

// Mock de Headless UI
vi.mock('@headlessui/react', () => ({
  Dialog: {
    Root: ({ children, open }) => open ? children : null,
    Panel: ({ children }) => React.createElement('div', { 'data-testid': 'dialog-panel' }, children),
    Title: ({ children }) => React.createElement('h2', { 'data-testid': 'dialog-title' }, children)
  }
}));

// Mock de window.matchMedia
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

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de URL.createObjectURL y URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock de console methods para tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});