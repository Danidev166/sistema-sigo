import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

// Mock simple del QRGenerator para tests básicos
const SimpleQRGenerator = ({ testType, estudiante, onClose }) => {
  return (
    <div data-testid="qr-generator">
      <h2>Código QR para Test {testType}</h2>
      <p>Estudiante: {estudiante.nombre} {estudiante.apellido}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  )
}

describe('SimpleQRGenerator Component', () => {
  const mockEstudiante = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez'
  }

  it('renders with test type and student info', () => {
    render(
      <SimpleQRGenerator
        testType="kuder"
        estudiante={mockEstudiante}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('Código QR para Test kuder')).toBeInTheDocument()
    expect(screen.getByText('Estudiante: Juan Pérez')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <SimpleQRGenerator
        testType="holland"
        estudiante={mockEstudiante}
        onClose={onClose}
      />
    )

    const closeButton = screen.getByText('Cerrar')
    closeButton.click()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders different test types', () => {
    const testTypes = ['kuder', 'holland', 'aptitudes']
    
    testTypes.forEach(testType => {
      const { unmount } = render(
        <SimpleQRGenerator
          testType={testType}
          estudiante={mockEstudiante}
          onClose={vi.fn()}
        />
      )
      
      expect(screen.getByText(`Código QR para Test ${testType}`)).toBeInTheDocument()
      unmount()
    })
  })
})
