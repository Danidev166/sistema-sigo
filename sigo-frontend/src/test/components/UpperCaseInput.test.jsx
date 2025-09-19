import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import UpperCaseInput from '../../components/ui/UpperCaseInput'

describe('UpperCaseInput Component', () => {
  it('renders input field', () => {
    render(
      <UpperCaseInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text"
      />
    )
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('converts input to uppercase automatically', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseInput
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello world' } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'HELLO WORLD'
        })
      })
    )
  })

  it('handles special characters correctly', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseInput
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello@world#123' } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'HELLO@WORLD#123'
        })
      })
    )
  })

  it('preserves existing value when typing', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseInput
        value="HELLO"
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('HELLO')
  })

  it('applies custom className', () => {
    render(
      <UpperCaseInput
        value=""
        onChange={vi.fn()}
        className="custom-class"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('handles all input props correctly', () => {
    render(
      <UpperCaseInput
        value="TEST"
        onChange={vi.fn()}
        placeholder="Enter text"
        name="test-input"
        id="test-id"
        required
        disabled
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('id', 'test-id')
    expect(input).toHaveAttribute('required')
    expect(input).toBeDisabled()
    expect(input).toHaveValue('TEST')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(
      <UpperCaseInput
        value=""
        onChange={vi.fn()}
        ref={ref}
      />
    )
    
    expect(ref).toHaveBeenCalled()
  })

  it('handles empty input', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseInput
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByRole('textbox')
    // Simular escribir algo y luego borrarlo
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.change(input, { target: { value: '' } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'TEST'
        })
      })
    )
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: ''
        })
      })
    )
  })
})
