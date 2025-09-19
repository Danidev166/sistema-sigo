import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/test-utils'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('renders default spinner', () => {
    render(<LoadingSpinner />)
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(document.querySelector('.h-4.w-4')).toBeInTheDocument()

    rerender(<LoadingSpinner size="md" />)
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument()
  })

  it('renders dots variant', () => {
    render(<LoadingSpinner variant="dots" />)
    
    const dots = document.querySelectorAll('.animate-bounce')
    expect(dots).toHaveLength(3)
  })

  it('renders pulse variant', () => {
    render(<LoadingSpinner variant="pulse" />)
    
    const pulse = document.querySelector('.animate-pulse')
    expect(pulse).toBeInTheDocument()
  })

  it('renders with text', () => {
    render(<LoadingSpinner text="Cargando..." />)
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders full screen when fullScreen prop is true', () => {
    render(<LoadingSpinner fullScreen={true} />)
    
    const container = document.querySelector('.fixed.inset-0')
    expect(container).toBeInTheDocument()
  })

  it('renders inline when fullScreen prop is false', () => {
    render(<LoadingSpinner fullScreen={false} />)
    
    const container = document.querySelector('.flex.items-center.justify-center')
    expect(container).toBeInTheDocument()
    expect(container).not.toHaveClass('fixed', 'inset-0')
  })

  it('has correct accessibility attributes', () => {
    render(<LoadingSpinner text="Cargando datos..." />)
    
    // Verificar que el texto de carga esté presente
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
  })

  it('applies correct CSS classes for default variant', () => {
    render(<LoadingSpinner size="md" />)
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-8', 'w-8', 'rounded-full', 'border-2')
  })

  it('applies correct CSS classes for dots variant', () => {
    render(<LoadingSpinner variant="dots" />)
    
    const dotsContainer = document.querySelector('.flex.space-x-1')
    expect(dotsContainer).toBeInTheDocument()
    
    const dots = document.querySelectorAll('.w-2.h-2.bg-blue-500.rounded-full.animate-bounce')
    expect(dots).toHaveLength(3)
  })
})
