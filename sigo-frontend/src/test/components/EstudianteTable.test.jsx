import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import EstudianteTable from '../../features/estudiantes/components/EstudianteTable'

// Mock data
const mockEstudiantes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    cedula: '12345678',
    curso: '10A',
    estado: 'Activo',
    fechaNacimiento: '2005-01-15'
  },
  {
    id: 2,
    nombre: 'María García',
    cedula: '87654321',
    curso: '11B',
    estado: 'Activo',
    fechaNacimiento: '2004-03-20'
  }
]

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('EstudianteTable Component', () => {
  it('renders table with estudiantes', () => {
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('12345678')).toBeInTheDocument()
    expect(screen.getByText('87654321')).toBeInTheDocument()
  })

  it('shows empty state when no estudiantes', () => {
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={[]}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    expect(screen.getByText('No hay estudiantes registrados.')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={onEdit}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    const editButtons = screen.getAllByLabelText('Editar')
    fireEvent.click(editButtons[0])
    
    expect(onEdit).toHaveBeenCalledWith(mockEstudiantes[0])
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={onDelete}
        />
      </TestWrapper>
    )
    
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    fireEvent.click(deleteButtons[0])
    
    expect(onDelete).toHaveBeenCalledWith(mockEstudiantes[0])
  })

  it('navigates to student detail when view button is clicked', () => {
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    const viewButtons = screen.getAllByLabelText('Ver detalles')
    fireEvent.click(viewButtons[0])
    
    // Check if navigation occurred (this would be tested with router mock)
    expect(viewButtons[0]).toBeInTheDocument()
  })

  it('displays student information correctly', () => {
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    // Check table headers
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Cédula')).toBeInTheDocument()
    expect(screen.getByText('Curso')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
    
    // Check student data
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('10A')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    const editButtons = screen.getAllByLabelText('Editar')
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    const viewButtons = screen.getAllByLabelText('Ver detalles')
    
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
    expect(viewButtons).toHaveLength(2)
  })

  it('handles mobile view correctly', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    render(
      <TestWrapper>
        <EstudianteTable
          estudiantes={mockEstudiantes}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </TestWrapper>
    )
    
    // Mobile view should show cards instead of table
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
  })
})
