import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import TextareaField from '../../features/estudiantes/components/TextareaField'

describe('TextareaField Component', () => {
  it('renders textarea with label', () => {
    render(
      <TextareaField
        label="Test Label"
        name="test-field"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has correct attributes', () => {
    render(
      <TextareaField
        label="Test Label"
        name="test-field"
        value="test value"
        onChange={vi.fn()}
        required={true}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'test-field')
    expect(textarea).toHaveAttribute('id', 'test-field')
    expect(textarea).toHaveAttribute('required')
    expect(textarea).toHaveValue('test value')
  })

  it('handles textarea changes', () => {
    const onChange = vi.fn()
    render(
      <TextareaField
        label="Test Label"
        name="test-field"
        value=""
        onChange={onChange}
      />
    )

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'new value' } })

    expect(onChange).toHaveBeenCalled()
  })

  it('shows required indicator when required', () => {
    render(
      <TextareaField
        label="Required Field"
        name="required-field"
        value=""
        onChange={vi.fn()}
        required={true}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('required')
  })

  it('does not show required indicator when not required', () => {
    render(
      <TextareaField
        label="Optional Field"
        name="optional-field"
        value=""
        onChange={vi.fn()}
        required={false}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).not.toHaveAttribute('required')
  })

  it('handles multiline text correctly', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3'
    render(
      <TextareaField
        label="Multiline Field"
        name="multiline-field"
        value={multilineText}
        onChange={vi.fn()}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue(multilineText)
  })

  it('has correct default rows', () => {
    render(
      <TextareaField
        label="Test Label"
        name="test-field"
        value=""
        onChange={vi.fn()}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('applies correct styling classes', () => {
    render(
      <TextareaField
        label="Test Label"
        name="test-field"
        value=""
        onChange={vi.fn()}
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('w-full', 'rounded-md', 'border')
  })
})
