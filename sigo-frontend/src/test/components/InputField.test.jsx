import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import InputField from '../../features/estudiantes/components/InputField'

describe('InputField Component', () => {
  it('renders input field with label', () => {
    render(
      <InputField
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
      <InputField
        label="Test Label"
        name="test-field"
        type="email"
        value="test@example.com"
        onChange={vi.fn()}
        required={true}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'test-field')
    expect(input).toHaveAttribute('id', 'test-field')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveValue('test@example.com')
  })

  it('handles text input changes', () => {
    const onChange = vi.fn()
    render(
      <InputField
        label="Test Label"
        name="test-field"
        value=""
        onChange={onChange}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(onChange).toHaveBeenCalled()
  })

  it('shows required indicator when required', () => {
    render(
      <InputField
        label="Required Field"
        name="required-field"
        value=""
        onChange={vi.fn()}
        required={true}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('required')
  })

  it('does not show required indicator when not required', () => {
    render(
      <InputField
        label="Optional Field"
        name="optional-field"
        value=""
        onChange={vi.fn()}
        required={false}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('required')
  })

  it('renders different input types', () => {
    const { rerender } = render(
      <InputField
        label="Text Field"
        name="text-field"
        type="text"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(
      <InputField
        label="Email Field"
        name="email-field"
        type="email"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(
      <InputField
        label="Password Field"
        name="password-field"
        type="password"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
  })

  it('has correct CSS classes', () => {
    render(
      <InputField
        label="Test Label"
        name="test-field"
        value=""
        onChange={vi.fn()}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('w-full', 'px-3', 'py-2', 'border', 'rounded-md')
  })

  it('has accessible label', () => {
    render(
      <InputField
        label="Accessible Label"
        name="accessible-field"
        value=""
        onChange={vi.fn()}
      />
    )

    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('for', 'accessible-field')
  })

  it('displays current value', () => {
    render(
      <InputField
        label="Test Label"
        name="test-field"
        value="current value"
        onChange={vi.fn()}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('CURRENT VALUE') // UpperCaseInput convierte a mayúsculas
  })
})
