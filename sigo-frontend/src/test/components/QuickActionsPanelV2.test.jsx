import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import QuickActionsPanelV2 from '../../features/dashboard/components/QuickActionsPanelV2'

describe('QuickActionsPanelV2 Component', () => {
  it('renders quick actions panel', () => {
    render(<QuickActionsPanelV2 />)
    
    expect(screen.getByText(/acciones rápidas/i)).toBeInTheDocument()
  })

  it('shows all quick action buttons', () => {
    render(<QuickActionsPanelV2 />)
    
    // Check for common quick actions
    expect(screen.getByText(/nuevo estudiante/i)).toBeInTheDocument()
    expect(screen.getByText(/agendar entrevista/i)).toBeInTheDocument()
    expect(screen.getByText(/generar reporte/i)).toBeInTheDocument()
  })

  it('handles button clicks', () => {
    const mockOnAction = vi.fn()
    render(<QuickActionsPanelV2 onAction={mockOnAction} />)
    
    const newStudentButton = screen.getByText(/nuevo estudiante/i)
    fireEvent.click(newStudentButton)
    
    expect(mockOnAction).toHaveBeenCalledWith('nuevo-estudiante')
  })

  it('shows different actions based on user role', () => {
    render(<QuickActionsPanelV2 userRole="admin" />)
    
    // Admin should see more actions
    expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument()
    expect(screen.getByText(/configuración/i)).toBeInTheDocument()
  })

  it('shows limited actions for regular users', () => {
    render(<QuickActionsPanelV2 userRole="user" />)
    
    // Regular users should see basic actions
    expect(screen.getByText(/nuevo estudiante/i)).toBeInTheDocument()
    expect(screen.queryByText(/gestión de usuarios/i)).not.toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<QuickActionsPanelV2 />)
    
    const panel = screen.getByText(/acciones rápidas/i).closest('div')
    expect(panel).toHaveClass('bg-white', 'dark:bg-slate-800', 'rounded-lg', 'shadow')
  })

  it('handles loading state', () => {
    render(<QuickActionsPanelV2 loading={true} />)
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error state when there is an error', () => {
    render(<QuickActionsPanelV2 error="Error loading actions" />)
    
    expect(screen.getByText('Error loading actions')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<QuickActionsPanelV2 />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label')
    })
  })

  it('handles keyboard navigation', () => {
    render(<QuickActionsPanelV2 />)
    
    const firstButton = screen.getAllByRole('button')[0]
    firstButton.focus()
    
    expect(document.activeElement).toBe(firstButton)
  })
})
