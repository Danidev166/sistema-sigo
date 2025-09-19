import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import LoginForm from '../../features/auth/components/LoginForm'

// Mock del servicio de autenticación
vi.mock('../../context/authService', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn()
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with email and password fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('has correct input types', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('has correct placeholders', () => {
    render(<LoginForm />)
    
    expect(screen.getByPlaceholderText(/ejemplo@liceo.cl/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('handles form input changes', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput).toHaveValue('test@test.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('has correct form structure', () => {
    render(<LoginForm />)
    
    // Buscar el form por su elemento HTML en lugar de por role
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('handles form submission', async () => {
    const { loginUser } = await import('../../context/authService')
    vi.mocked(loginUser).mockResolvedValue({
      token: 'mock-token',
      usuario: { id: 1, nombre: 'Test User' }
    })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      })
    })
  })

  it('handles login error', async () => {
    const { loginUser } = await import('../../context/authService')
    vi.mocked(loginUser).mockRejectedValue({
      response: { data: { error: 'Credenciales inválidas' } }
    })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    })
  })
})
