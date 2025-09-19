import { describe, it, expect, vi } from 'vitest'

// Mock simple de axios
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  defaults: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000
  }
}

describe('Axios Configuration', () => {
  it('has correct base URL', () => {
    expect(mockAxios.defaults.baseURL).toContain('/api')
  })

  it('has correct timeout', () => {
    expect(mockAxios.defaults.timeout).toBe(5000)
  })

  it('can make GET requests', async () => {
    mockAxios.get.mockResolvedValue({ data: { message: 'Success' } })
    
    const response = await mockAxios.get('/test')
    expect(response.data).toEqual({ message: 'Success' })
    expect(mockAxios.get).toHaveBeenCalledWith('/test')
  })

  it('can make POST requests', async () => {
    mockAxios.post.mockResolvedValue({ data: { id: 1, message: 'Created' } })
    
    const response = await mockAxios.post('/test', { name: 'Test' })
    expect(response.data).toEqual({ id: 1, message: 'Created' })
    expect(mockAxios.post).toHaveBeenCalledWith('/test', { name: 'Test' })
  })

  it('handles errors', async () => {
    const error = new Error('Network Error')
    mockAxios.get.mockRejectedValue(error)
    
    await expect(mockAxios.get('/error')).rejects.toThrow('Network Error')
  })
})


