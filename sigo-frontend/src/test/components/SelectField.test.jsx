import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import SelectField from '../../features/estudiantes/components/SelectField'

describe('SelectField Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  it('renders select field with label', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    expect(screen.getByText('Seleccione una opción')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('has correct attributes', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value="option1"
        onChange={vi.fn()}
        options={mockOptions}
        required={true}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('name', 'test-select')
    expect(select).toHaveAttribute('id', 'test-select')
    expect(select).toHaveAttribute('required')
    expect(select).toHaveValue('option1')
  })

  it('handles selection changes', () => {
    const onChange = vi.fn()
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={onChange}
        options={mockOptions}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option2' } })

    expect(onChange).toHaveBeenCalled()
  })

  it('shows required indicator when required', () => {
    render(
      <SelectField
        label="Required Field"
        name="required-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        required={true}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('required')
  })

  it('does not show required indicator when not required', () => {
    render(
      <SelectField
        label="Optional Field"
        name="optional-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        required={false}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).not.toHaveAttribute('required')
  })

  it('has correct CSS classes', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('w-full', 'rounded-md', 'border', 'py-2', 'px-3')
  })

  it('has accessible label', () => {
    render(
      <SelectField
        label="Accessible Label"
        name="accessible-select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('for', 'accessible-select')
  })

  it('displays current value', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value="option2"
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('option2')
  })

  it('renders with empty options array', () => {
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={vi.fn()}
        options={[]}
      />
    )

    expect(screen.getByText('Seleccione una opción')).toBeInTheDocument()
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('handles option selection correctly', () => {
    const onChange = vi.fn()
    render(
      <SelectField
        label="Test Label"
        name="test-select"
        value=""
        onChange={onChange}
        options={mockOptions}
      />
    )

    const select = screen.getByRole('combobox')
    
    // Seleccionar la primera opción
    fireEvent.change(select, { target: { value: 'option1' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expect.any(Object))
  })
})
