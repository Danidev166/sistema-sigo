import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import UpperCaseTextarea from '../../components/ui/UpperCaseTextarea'

describe('UpperCaseTextarea Component', () => {
  it('renders textarea field', () => {
    render(
      <UpperCaseTextarea
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
      <UpperCaseTextarea
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'hello world\nthis is a test' } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'HELLO WORLD\nTHIS IS A TEST'
        })
      })
    )
  })

  it('handles multiline text correctly', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseTextarea
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    const multilineText = 'line one\nline two\nline three'
    fireEvent.change(textarea, { target: { value: multilineText } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'LINE ONE\nLINE TWO\nLINE THREE'
        })
      })
    )
  })

  it('preserves existing value when typing', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseTextarea
        value="HELLO\nWORLD"
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('HELLO\nWORLD')
  })

  it('applies custom className', () => {
    render(
      <UpperCaseTextarea
        value=""
        onChange={vi.fn()}
        className="custom-class"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-class')
  })

  it('handles all textarea props correctly', () => {
    render(
      <UpperCaseTextarea
        value="TEST"
        onChange={vi.fn()}
        placeholder="Enter text"
        name="test-textarea"
        id="test-id"
        required
        disabled
        rows={5}
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'test-textarea')
    expect(textarea).toHaveAttribute('id', 'test-id')
    expect(textarea).toHaveAttribute('required')
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveValue('TEST')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(
      <UpperCaseTextarea
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
      <UpperCaseTextarea
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    // Simular escribir algo y luego borrarlo
    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.change(textarea, { target: { value: '' } })
    
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

  it('handles special characters and symbols', () => {
    const handleChange = vi.fn()
    render(
      <UpperCaseTextarea
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'hello@world#123$%^&*()' } })
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'HELLO@WORLD#123$%^&*()'
        })
      })
    )
  })
})
