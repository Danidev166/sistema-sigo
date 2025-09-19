# 🧪 Testing Guide - Sistema SIGO

## 📋 Stack de Testing

- **Vitest**: Test runner nativo de Vite
- **React Testing Library**: Testing de componentes React
- **MSW**: Mock Service Worker para APIs
- **jsdom**: Simulación del DOM
- **@testing-library/jest-dom**: Matchers adicionales

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Abrir interfaz visual de tests
npm run test:ui

# Ejecutar tests de integración
npm run test:integration
```

## 📁 Estructura de Testing

```
src/test/
├── components/          # Tests de componentes UI
├── features/           # Tests de features específicas
├── hooks/              # Tests de custom hooks
├── services/           # Tests de servicios API
├── mocks/              # Mocks y handlers de MSW
├── utils/              # Utilidades de testing
└── setup.ts           # Configuración global
```

## 🎯 Tipos de Tests

### 1. **Component Tests**
```typescript
// Ejemplo: Button.test.tsx
import { render, screen, fireEvent } from '../utils/test-utils'
import Button from '../../components/ui/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### 2. **Feature Tests**
```typescript
// Ejemplo: UsuariosPage.test.tsx
import { render, screen, waitFor } from '../utils/test-utils'
import UsuariosPage from '../../features/usuarios/pages/UsuariosPage'

describe('UsuariosPage', () => {
  it('displays list of usuarios', async () => {
    render(<UsuariosPage />)
    await waitFor(() => {
      expect(screen.getByText('Admin Test')).toBeInTheDocument()
    })
  })
})
```

### 3. **Service Tests**
```typescript
// Ejemplo: axios.test.ts
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('Axios Service', () => {
  it('makes successful GET request', async () => {
    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json({ message: 'Success' })
      })
    )
    // Test implementation
  })
})
```

### 4. **Hook Tests**
```typescript
// Ejemplo: useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../context/useAuth'

describe('useAuth Hook', () => {
  it('handles login successfully', async () => {
    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: '123' })
    })
    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

## 🔧 Utilidades de Testing

### **test-utils.tsx**
```typescript
import { customRender, renderWithAuth } from '../utils/test-utils'

// Render básico
customRender(<Component />)

// Render con contexto de auth
renderWithAuth(<Component />, mockAuthContext)
```

### **Mocks Disponibles**
```typescript
import { mockUser, mockApiResponse, mockApiError } from '../utils/test-utils'

// Usuario mock
const user = mockUser

// Respuesta de API mock
const response = mockApiResponse({ data: 'test' })

// Error de API mock
const error = mockApiError('Error message', 500)
```

## 📊 Cobertura de Código

### **Umbrales Configurados**
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Archivos Excluidos**
- `node_modules/`
- `src/test/`
- `**/*.d.ts`
- `**/*.config.js`
- `dist/`
- `coverage/`

## 🎨 Mejores Prácticas

### 1. **Naming Conventions**
```typescript
// ✅ Bueno
describe('Button Component', () => {
  it('renders button with text', () => {})
  it('handles click events', () => {})
  it('applies variant styles correctly', () => {})
})

// ❌ Malo
describe('Button', () => {
  it('works', () => {})
  it('test', () => {})
})
```

### 2. **Arrange-Act-Assert**
```typescript
it('handles form submission', async () => {
  // Arrange
  const mockSubmit = vi.fn()
  render(<Form onSubmit={mockSubmit} />)
  
  // Act
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  expect(mockSubmit).toHaveBeenCalled()
})
```

### 3. **Testing User Interactions**
```typescript
import userEvent from '@testing-library/user-event'

it('handles user input', async () => {
  const user = userEvent.setup()
  render(<Input />)
  
  await user.type(screen.getByRole('textbox'), 'Hello World')
  expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument()
})
```

### 4. **Async Testing**
```typescript
it('loads data on mount', async () => {
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

## 🚨 Debugging Tests

### **Vitest UI**
```bash
npm run test:ui
```
Abre interfaz visual para debugging

### **Console Logs**
```typescript
import { screen } from '@testing-library/react'

// Debug DOM
screen.debug()

// Debug elemento específico
screen.debug(screen.getByRole('button'))
```

### **Coverage Report**
```bash
npm run test:coverage
```
Genera reporte de cobertura en `coverage/`

## 📝 Ejemplos Completos

Ver archivos en:
- `src/test/components/Button.test.tsx`
- `src/test/features/auth/LoginForm.test.tsx`
- `src/test/services/axios.test.ts`
- `src/test/hooks/useAuth.test.ts`

## 🔗 Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)


