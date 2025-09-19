import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import AgendaTable from '../../features/agenda/components/AgendaTable'

// Mock data
const mockAgendaItems = [
  {
    id: 1,
    estudiante: {
      nombre: 'Juan Pérez',
      cedula: '12345678'
    },
    fecha: '2024-01-15',
    hora: '09:00',
    motivo: 'Orientación vocacional',
    profesional: 'Dr. García',
    estado: 'Programada'
  },
  {
    id: 2,
    estudiante: {
      nombre: 'María García',
      cedula: '87654321'
    },
    fecha: '2024-01-16',
    hora: '10:30',
    motivo: 'Seguimiento académico',
    profesional: 'Dra. López',
    estado: 'Completada'
  }
]

describe('AgendaTable Component', () => {
  it('renders table with agenda items', () => {
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('09:00')).toBeInTheDocument()
    expect(screen.getByText('10:30')).toBeInTheDocument()
  })

  it('shows empty state when no agenda items', () => {
    render(
      <AgendaTable
        agendaItems={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    expect(screen.getByText(/no hay citas/i)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    const editButtons = screen.getAllByLabelText('Editar')
    fireEvent.click(editButtons[0])
    
    expect(onEdit).toHaveBeenCalledWith(mockAgendaItems[0])
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    fireEvent.click(deleteButtons[0])
    
    expect(onDelete).toHaveBeenCalledWith(mockAgendaItems[0])
  })

  it('calls onRegistrarEntrevista when register button is clicked', () => {
    const onRegistrarEntrevista = vi.fn()
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={onRegistrarEntrevista}
      />
    )
    
    const registerButtons = screen.getAllByLabelText('Registrar entrevista')
    fireEvent.click(registerButtons[0])
    
    expect(onRegistrarEntrevista).toHaveBeenCalledWith(mockAgendaItems[0])
  })

  it('displays agenda information correctly', () => {
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    // Check table headers
    expect(screen.getByText('Estudiante')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Hora')).toBeInTheDocument()
    expect(screen.getByText('Motivo')).toBeInTheDocument()
    expect(screen.getByText('Profesional')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
    
    // Check agenda data
    expect(screen.getByText('Orientación vocacional')).toBeInTheDocument()
    expect(screen.getByText('Dr. García')).toBeInTheDocument()
    expect(screen.getByText('Programada')).toBeInTheDocument()
  })

  it('shows different states correctly', () => {
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    expect(screen.getByText('Programada')).toBeInTheDocument()
    expect(screen.getByText('Completada')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    const editButtons = screen.getAllByLabelText('Editar')
    const deleteButtons = screen.getAllByLabelText('Eliminar')
    const registerButtons = screen.getAllByLabelText('Registrar entrevista')
    
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
    expect(registerButtons).toHaveLength(2)
  })

  it('handles mobile view correctly', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    render(
      <AgendaTable
        agendaItems={mockAgendaItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRegistrarEntrevista={vi.fn()}
      />
    )
    
    // Mobile view should show cards instead of table
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
  })
})
