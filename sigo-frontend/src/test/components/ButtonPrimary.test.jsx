import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import ButtonPrimary from '../../components/ui/ButtonPrimary'

describe('ButtonPrimary Component', () => {
  it('renders button with text', () => {
    render(<ButtonPrimary>Click me</ButtonPrimary>)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<ButtonPrimary onClick={handleClick}>Click me</ButtonPrimary>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<ButtonPrimary className="custom-class">Click me</ButtonPrimary>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('can be disabled', () => {
    render(<ButtonPrimary disabled>Click me</ButtonPrimary>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows loading state when loading prop is true', () => {
    render(<ButtonPrimary loading>Click me</ButtonPrimary>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    // Check for loading spinner or text
    expect(screen.getByText(/cargando/i) || screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<ButtonPrimary variant="small">Small</ButtonPrimary>)
    expect(screen.getByRole('button')).toHaveClass('px-2', 'py-1', 'text-sm')
    
    rerender(<ButtonPrimary variant="large">Large</ButtonPrimary>)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<ButtonPrimary ref={ref}>Click me</ButtonPrimary>)
    
    expect(ref).toHaveBeenCalled()
  })
})
