import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthProvider'
import { Toaster } from 'react-hot-toast'

// Mock del AuthContext para testing
const mockAuthContext = {
  user: {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@test.com',
    rol: 'Admin',
    estado: true
  },
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn()
}

// Wrapper personalizado para testing
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}

// Función de render personalizada
const customRender = (ui, options = {}) => render(ui, { wrapper: AllTheProviders, ...options })

// Función para renderizar con contexto de auth personalizado
const renderWithAuth = (ui, authContext = mockAuthContext, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Helper para simular usuario logueado
export const mockUser = {
  id: 1,
  nombre: 'Test',
  apellido: 'User',
  email: 'test@test.com',
  rol: 'Admin',
  estado: true
}

// Helper para simular localStorage
export const mockLocalStorage = {
  getItem: vi.fn((key) => {
    if (key === 'token') return 'mock-jwt-token'
    if (key === 'user') return JSON.stringify(mockUser)
    return null
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Helper para simular API responses
export const mockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {}
})

// Helper para simular errores de API
export const mockApiError = (message, status = 500) => ({
  response: {
    data: { error: message },
    status,
    statusText: 'Internal Server Error',
    headers: {},
    config: {}
  }
})

// Re-export everything
export * from '@testing-library/react'
export { customRender as render, renderWithAuth }

