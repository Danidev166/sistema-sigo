import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'
import OptimizedSummaryCard from '../../features/dashboard/components/OptimizedSummaryCard'

describe('OptimizedSummaryCard Component', () => {
  it('renders summary card with title and value', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
      />
    )
    
    expect(screen.getByText('Total Estudiantes')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        loading={true}
      />
    )
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        error="Error loading data"
      />
    )
    
    expect(screen.getByText('Error loading data')).toBeInTheDocument()
  })

  it('displays percentage change when provided', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        change={5.2}
        changeType="increase"
      />
    )
    
    expect(screen.getByText('+5.2%')).toBeInTheDocument()
  })

  it('shows different change types correctly', () => {
    const { rerender } = render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        change={5.2}
        changeType="increase"
      />
    )
    
    expect(screen.getByText('+5.2%')).toHaveClass('text-green-600')
    
    rerender(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        change={3.1}
        changeType="decrease"
      />
    )
    
    expect(screen.getByText('-3.1%')).toHaveClass('text-red-600')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        onClick={handleClick}
      />
    )
    
    const card = screen.getByText('Total Estudiantes').closest('div')
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
        className="custom-class"
      />
    )
    
    const card = screen.getByText('Total Estudiantes').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('shows different icons correctly', () => {
    const { rerender } = render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
      />
    )
    
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    
    rerender(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="calendar"
      />
    )
    
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={1500000}
        icon="users"
      />
    )
    
    expect(screen.getByText('1.5M')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <OptimizedSummaryCard
        title="Total Estudiantes"
        value={150}
        icon="users"
      />
    )
    
    const card = screen.getByText('Total Estudiantes').closest('div')
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabindex', '0')
  })
})
