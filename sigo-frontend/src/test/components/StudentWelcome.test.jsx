import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import StudentWelcome from '../../features/test-vocacionales/components/StudentWelcome'

// Mock data
const mockEstudiante = {
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  cedula: '12345678',
  curso: '10A'
}

describe('StudentWelcome Component', () => {
  it('renders welcome message with student name', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText('¡Bienvenido/a!')).toBeInTheDocument()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
  })

  it('shows test type information', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/test de kuder/i)).toBeInTheDocument()
  })

  it('calls onStart when start button is clicked', () => {
    const onStart = vi.fn()
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={onStart}
      />
    )
    
    const startButton = screen.getByText(/comenzar test/i)
    fireEvent.click(startButton)
    
    expect(onStart).toHaveBeenCalled()
  })

  it('shows test instructions', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/instrucciones/i)).toBeInTheDocument()
    expect(screen.getByText(/tiempo estimado/i)).toBeInTheDocument()
  })

  it('displays different test types correctly', () => {
    const { rerender } = render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/test de kuder/i)).toBeInTheDocument()
    
    rerender(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="holland"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/test de holland/i)).toBeInTheDocument()
  })

  it('shows estimated time for different tests', () => {
    const { rerender } = render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/15-20 minutos/i)).toBeInTheDocument()
    
    rerender(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="holland"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText(/10-15 minutos/i)).toBeInTheDocument()
  })

  it('handles loading state', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
        loading={true}
      />
    )
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
        error="Error loading test"
      />
    )
    
    expect(screen.getByText('Error loading test')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    const startButton = screen.getByText(/comenzar test/i)
    expect(startButton).toHaveAttribute('role', 'button')
    expect(startButton).toHaveAttribute('aria-label')
  })

  it('shows student course information', () => {
    render(
      <StudentWelcome
        estudiante={mockEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText('10A')).toBeInTheDocument()
  })

  it('handles missing student data gracefully', () => {
    const incompleteEstudiante = {
      id: 1,
      nombre: 'Juan'
      // Missing other fields
    }
    
    render(
      <StudentWelcome
        estudiante={incompleteEstudiante}
        testType="kuder"
        onStart={vi.fn()}
      />
    )
    
    expect(screen.getByText('¡Bienvenido/a!')).toBeInTheDocument()
    expect(screen.getByText('Juan')).toBeInTheDocument()
  })
})
