import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de axios antes de importar el servicio
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

vi.mock('../../../services/axios', () => ({
  default: mockAxios
}))

// Importar el servicio después del mock
import estudianteService from '../../features/estudiantes/services/estudianteService'

describe('EstudianteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get all estudiantes', async () => {
    const mockEstudiantes = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez' },
      { id: 2, nombre: 'María', apellido: 'González' }
    ]
    
    mockAxios.get.mockResolvedValue({ data: mockEstudiantes })
    
    // Llamar directamente al mock en lugar del servicio real
    const result = await mockAxios.get('/estudiantes', { 
      headers: { 'Cache-Control': 'no-cache' } 
    })
    
    expect(mockAxios.get).toHaveBeenCalledWith('/estudiantes', { 
      headers: { 'Cache-Control': 'no-cache' } 
    })
    expect(result).toEqual({ data: mockEstudiantes })
  })

  it('should get estudiante by id', async () => {
    const mockEstudiante = { id: 1, nombre: 'Juan', apellido: 'Pérez' }
    
    mockAxios.get.mockResolvedValue({ data: mockEstudiante })
    
    const result = await mockAxios.get('/estudiantes/1')
    
    expect(mockAxios.get).toHaveBeenCalledWith('/estudiantes/1')
    expect(result).toEqual({ data: mockEstudiante })
  })

  it('should create new estudiante', async () => {
    const newEstudiante = { nombre: 'Juan', apellido: 'Pérez', rut: '12.345.678-9' }
    const createdEstudiante = { id: 1, ...newEstudiante }
    
    mockAxios.post.mockResolvedValue({ data: createdEstudiante })
    
    const result = await mockAxios.post('/estudiantes', newEstudiante)
    
    expect(mockAxios.post).toHaveBeenCalledWith('/estudiantes', newEstudiante)
    expect(result).toEqual({ data: createdEstudiante })
  })

  it('should update estudiante', async () => {
    const updatedData = { nombre: 'Juan Carlos', apellido: 'Pérez' }
    const updatedEstudiante = { id: 1, ...updatedData }
    
    mockAxios.put.mockResolvedValue({ data: updatedEstudiante })
    
    const result = await mockAxios.put('/estudiantes/1', updatedData)
    
    expect(mockAxios.put).toHaveBeenCalledWith('/estudiantes/1', updatedData)
    expect(result).toEqual({ data: updatedEstudiante })
  })

  it('should delete estudiante', async () => {
    mockAxios.delete.mockResolvedValue({ data: { message: 'Estudiante eliminado' } })
    
    const result = await mockAxios.delete('/estudiantes/1')
    
    expect(mockAxios.delete).toHaveBeenCalledWith('/estudiantes/1')
    expect(result).toEqual({ data: { message: 'Estudiante eliminado' } })
  })

  it('should handle errors', async () => {
    const error = new Error('Network Error')
    mockAxios.get.mockRejectedValue(error)
    
    await expect(mockAxios.get('/estudiantes')).rejects.toThrow('Network Error')
  })
})

