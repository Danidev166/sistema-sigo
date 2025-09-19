import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import EstudianteSelector from '../../components/ui/EstudianteSelector'

// Mock data
const mockEstudiantes = [
  { id: 1, nombre: 'Juan Pérez', cedula: '12345678' },
  { id: 2, nombre: 'María García', cedula: '87654321' },
  { id: 3, nombre: 'Carlos López', cedula: '11223344' }
]

describe('EstudianteSelector Component', () => {
  it('renders selector with placeholder', () => {
    render(
      <EstudianteSelector
        estudiantes={mockEstudiantes}
        onSelect={vi.fn()}
        placeholder="Seleccionar estudiante"
      />
    )
    
    expect(screen.getByPlaceholderText('Seleccionar estudiante')).toBeInTheDocument()
  })

  it('shows loading state when loading', () => {
    render(
      <EstudianteSelector
        estudiantes={[]}
        onSelect={vi.fn()}
        loading={true}
      />
    )
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('displays error message when error occurs', () => {
    render(
      <EstudianteSelector
        estudiantes={[]}
        onSelect={vi.fn()}
        error="Error al cargar estudiantes"
      />
    )
    
    expect(screen.getByText('Error al cargar estudiantes')).toBeInTheDocument()
  })

  it('shows empty state when no estudiantes', () => {
    render(
      <EstudianteSelector
        estudiantes={[]}
        onSelect={vi.fn()}
      />
    )
    
    expect(screen.getByText(/no hay estudiantes/i)).toBeInTheDocument()
  })

  it('calls onSelect when estudiante is selected', async () => {
    const onSelect = vi.fn()
    render(
      <EstudianteSelector
        estudiantes={mockEstudiantes}
        onSelect={onSelect}
      />
    )
    
    const input = screen.getByRole('combobox')
    fireEvent.click(input)
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Juan Pérez'))
    
    expect(onSelect).toHaveBeenCalledWith(mockEstudiantes[0])
  })

  it('filters estudiantes by search term', async () => {
    render(
      <EstudianteSelector
        estudiantes={mockEstudiantes}
        onSelect={vi.fn()}
      />
    )
    
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Juan' } })
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.queryByText('María García')).not.toBeInTheDocument()
    })
  })

  it('handles disabled state', () => {
    render(
      <EstudianteSelector
        estudiantes={mockEstudiantes}
        onSelect={vi.fn()}
        disabled={true}
      />
    )
    
    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
  })

  it('shows selected estudiante', () => {
    render(
      <EstudianteSelector
        estudiantes={mockEstudiantes}
        onSelect={vi.fn()}
        selectedEstudiante={mockEstudiantes[0]}
      />
    )
    
    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument()
  })
})
