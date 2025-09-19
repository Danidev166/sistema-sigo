import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import MobileMenuButton from '../../components/ui/MobileMenuButton'

describe('MobileMenuButton Component', () => {
  it('renders button with hamburger icon', () => {
    render(<MobileMenuButton onClick={vi.fn()} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Abrir menú')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<MobileMenuButton onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows different icon when menu is open', () => {
    const { rerender } = render(<MobileMenuButton onClick={vi.fn()} isOpen={false} />)
    
    expect(screen.getByTestId('hamburger-icon')).toBeInTheDocument()
    
    rerender(<MobileMenuButton onClick={vi.fn()} isOpen={true} />)
    
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<MobileMenuButton onClick={vi.fn()} className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('can be disabled', () => {
    render(<MobileMenuButton onClick={vi.fn()} disabled />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('has correct accessibility attributes', () => {
    render(<MobileMenuButton onClick={vi.fn()} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Abrir menú')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('updates aria-expanded when menu state changes', () => {
    const { rerender } = render(<MobileMenuButton onClick={vi.fn()} isOpen={false} />)
    
    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    
    rerender(<MobileMenuButton onClick={vi.fn()} isOpen={true} />)
    
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
