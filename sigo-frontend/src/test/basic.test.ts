import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle strings', () => {
    expect('hello').toContain('hello')
  })

  it('should handle arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('should handle objects', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('test')
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve('async result')
    await expect(promise).resolves.toBe('async result')
  })
})


