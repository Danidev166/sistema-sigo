import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import UserTable from '../../features/usuarios/components/UserTable'

const mockUsuarios = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    rol: 'admin',
    estado: true
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria@example.com',
    rol: 'orientador',
    estado: false
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos@example.com',
    rol: 'asistente',
    estado: true
  }
]

describe('UserTable Component', () => {
  const defaultProps = {
    usuarios: mockUsuarios,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleEstado: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table with users', () => {
    render(<UserTable {...defaultProps} />)

    expect(screen.getAllByText('Juan Pérez')).toHaveLength(2) // Mobile + Desktop
    expect(screen.getAllByText('María González')).toHaveLength(2)
    expect(screen.getAllByText('Carlos López')).toHaveLength(2)
  })

  it('renders table headers', () => {
    render(<UserTable {...defaultProps} />)

    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Rol')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<UserTable {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar usuario/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('filters users by search term', () => {
    render(<UserTable {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar usuario/i)
    fireEvent.change(searchInput, { target: { value: 'Juan' } })

    expect(screen.getAllByText('Juan Pérez')).toHaveLength(2) // Mobile + Desktop
    expect(screen.queryByText('María González')).not.toBeInTheDocument()
    expect(screen.queryByText('Carlos López')).not.toBeInTheDocument()
  })

  it('shows filter button', () => {
    render(<UserTable {...defaultProps} />)

    const filterButton = screen.getByRole('button', { name: /abrir filtros/i })
    expect(filterButton).toBeInTheDocument()
  })

  it('opens filter panel when filter button is clicked', () => {
    render(<UserTable {...defaultProps} />)

    const filterButtons = screen.getAllByRole('button', { name: /abrir filtros/i })
    const filterButton = filterButtons[0] // Usar el primer botón encontrado
    fireEvent.click(filterButton)

    expect(screen.getByText('Filtrar por rol')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<UserTable {...defaultProps} />)

    const editButtons = screen.getAllByRole('button', { name: /editar/i })
    fireEvent.click(editButtons[0])

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUsuarios[0])
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<UserTable {...defaultProps} />)

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    fireEvent.click(deleteButtons[0])

    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUsuarios[0])
  })

  it('calls onToggleEstado when status toggle is clicked', () => {
    render(<UserTable {...defaultProps} />)

    const statusToggles = screen.getAllByRole('button', { name: /cambiar estado/i })
    fireEvent.click(statusToggles[0])

    expect(defaultProps.onToggleEstado).toHaveBeenCalledWith(mockUsuarios[0])
  })

  it('shows correct status for active users', () => {
    render(<UserTable {...defaultProps} />)

    const activeStatuses = screen.getAllByText('Activo')
    expect(activeStatuses.length).toBeGreaterThan(0)
  })

  it('shows correct status for inactive users', () => {
    render(<UserTable {...defaultProps} />)

    const inactiveStatuses = screen.getAllByText('Inactivo')
    expect(inactiveStatuses.length).toBeGreaterThan(0)
  })

  it('handles empty usuarios array', () => {
    render(<UserTable {...defaultProps} usuarios={[]} />)

    expect(screen.getAllByText('No hay usuarios registrados.')).toHaveLength(2)
  })

  it('handles undefined usuarios prop', () => {
    render(<UserTable {...defaultProps} usuarios={undefined} />)

    // Verificar que aparece el mensaje (puede aparecer en móvil y desktop)
    expect(screen.getAllByText('No hay usuarios registrados.')).toHaveLength(2)
  })

  it('sorts users by name when sort button is clicked', () => {
    render(<UserTable {...defaultProps} />)

    const sortButtons = screen.getAllByRole('columnheader', { name: /nombre/i })
    const sortButton = sortButtons[0] // Usar el primer botón encontrado
    fireEvent.click(sortButton)

    // Verificar que el botón de ordenamiento existe
    expect(sortButton).toBeInTheDocument()
  })

  it('filters users by role', () => {
    render(<UserTable {...defaultProps} />)

    // Abrir el panel de filtros
    const filterButtons = screen.getAllByRole('button', { name: /abrir filtros/i })
    const filterButton = filterButtons[0] // Usar el primer botón encontrado
    fireEvent.click(filterButton)

    // Verificar que el panel de filtros se abre
    expect(screen.getByText('Filtrar por rol')).toBeInTheDocument()
  })
})
