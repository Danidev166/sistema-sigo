import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'

// Mock simple del componente Button
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
      ${size === 'lg' ? 'px-6 py-3' : 'px-4 py-2'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      text-white font-semibold rounded-md transition-colors duration-200
    `}
    {...props}
  >
    {loading ? 'Cargando...' : children}
  </button>
)

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-500')
  })

  it('applies size styles correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-3')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })
})