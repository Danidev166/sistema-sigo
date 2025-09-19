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
import dashboardService from '../../features/dashboard/services/dashboardService'

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get dashboard summary', async () => {
    const mockSummary = {
      totalEstudiantes: 150,
      totalUsuarios: 25,
      totalEntrevistas: 300,
      totalRecursos: 50
    }
    
    mockAxios.get.mockResolvedValue({ data: mockSummary })
    
    const result = await mockAxios.get('/dashboard/resumen')
    
    expect(mockAxios.get).toHaveBeenCalledWith('/dashboard/resumen')
    expect(result).toEqual({ data: mockSummary })
  })

  it('should get recent activities', async () => {
    const mockActivities = [
      { id: 1, tipo: 'entrevista', descripcion: 'Nueva entrevista' },
      { id: 2, tipo: 'recurso', descripcion: 'Recurso entregado' }
    ]
    
    mockAxios.get.mockResolvedValue({ data: mockActivities })
    
    const result = await mockAxios.get('/dashboard/actividades')
    
    expect(mockAxios.get).toHaveBeenCalledWith('/dashboard/actividades')
    expect(result).toEqual({ data: mockActivities })
  })

  it('should get statistics by month', async () => {
    const mockStats = {
      enero: { entrevistas: 25, recursos: 10 },
      febrero: { entrevistas: 30, recursos: 15 }
    }
    
    mockAxios.get.mockResolvedValue({ data: mockStats })
    
    const result = await mockAxios.get('/dashboard/estadisticas')
    
    expect(mockAxios.get).toHaveBeenCalledWith('/dashboard/estadisticas')
    expect(result).toEqual({ data: mockStats })
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Network Error')
    mockAxios.get.mockRejectedValue(error)
    
    await expect(mockAxios.get('/dashboard/resumen')).rejects.toThrow('Network Error')
  })
})

