import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import AlertaTable from '../../features/alertas/components/AlertaTable'

// Mock data
const mockAlertas = [
  {
    id: 1,
    titulo: 'Alerta de ausentismo',
    descripcion: 'El estudiante ha faltado 3 días consecutivos',
    tipo: 'Ausentismo',
    prioridad: 'Alta',
    fecha: '2024-01-15',
    estado: 'Activa',
    estudiante: {
      nombre: 'Juan Pérez',
      cedula: '12345678'
    }
  },
  {
    id: 2,
    titulo: 'Alerta de rendimiento',
    descripcion: 'Bajo rendimiento en matemáticas',
    tipo: 'Académico',
    prioridad: 'Media',
    fecha: '2024-01-16',
    estado: 'Resuelta',
    estudiante: {
      nombre: 'María García',
      cedula: '87654321'
    }
  }
]

describe('AlertaTable Component', () => {
  it('renders table with alertas', () => {
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    expect(screen.getByText('Alerta de ausentismo')).toBeInTheDocument()
    expect(screen.getByText('Alerta de rendimiento')).toBeInTheDocument()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
  })

  it('shows empty state when no alertas', () => {
    render(
      <AlertaTable
        alertas={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    expect(screen.getByText(/no hay alertas/i)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    const editButtons = screen.getAllByLabelText('Editar')
    fireEvent.click(editButtons[0])
    
    expect(onEdit).toHaveBeenCalledWith(mockAlertas[0])
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onResolve={vi.fn()}
      />
    )
    
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    fireEvent.click(deleteButtons[0])
    
    expect(onDelete).toHaveBeenCalledWith(mockAlertas[0])
  })

  it('calls onResolve when resolve button is clicked', () => {
    const onResolve = vi.fn()
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={onResolve}
      />
    )
    
    const resolveButtons = screen.getAllByLabelText('Resolver')
    fireEvent.click(resolveButtons[0])
    
    expect(onResolve).toHaveBeenCalledWith(mockAlertas[0])
  })

  it('displays alerta information correctly', () => {
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    // Check table headers
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Prioridad')).toBeInTheDocument()
    expect(screen.getByText('Estudiante')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
    
    // Check alerta data
    expect(screen.getByText('Ausentismo')).toBeInTheDocument()
    expect(screen.getByText('Académico')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
  })

  it('shows different priority levels correctly', () => {
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
  })

  it('shows different states correctly', () => {
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Resuelta')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    const editButtons = screen.getAllByLabelText('Editar')
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    const resolveButtons = screen.getAllByLabelText('Resolver')
    
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
    expect(resolveButtons).toHaveLength(2)
  })

  it('handles mobile view correctly', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    render(
      <AlertaTable
        alertas={mockAlertas}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResolve={vi.fn()}
      />
    )
    
    // Mobile view should show cards instead of table
    expect(screen.getByText('Alerta de ausentismo')).toBeInTheDocument()
    expect(screen.getByText('Alerta de rendimiento')).toBeInTheDocument()
  })
})
