import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import CheckboxField from '../../components/ui/CheckboxField'

describe('CheckboxField Component', () => {
  it('renders checkbox with label', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('has correct attributes', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('type', 'checkbox')
    expect(checkbox).toHaveAttribute('name', 'test-checkbox')
    expect(checkbox).toHaveAttribute('id', 'test-checkbox')
  })

  it('shows checked state correctly', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={true}
        onChange={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('shows unchecked state correctly', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={onChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('test-checkbox', true)
  })

  it('calls onChange with correct parameters when unchecked', () => {
    const onChange = vi.fn()
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={true}
        onChange={onChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('test-checkbox', false)
  })

  it('has correct CSS classes', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded', 'border-gray-300')
  })

  it('has accessible label', () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="Accessible Label"
        checked={false}
        onChange={vi.fn()}
      />
    )

    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('for', 'test-checkbox')
    expect(label).toHaveClass('cursor-pointer')
  })

  it('handles multiple clicks correctly', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={false}
        onChange={onChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    
    // Primer click - cambia a true
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith('test-checkbox', true)
    
    // Simular que el estado cambió a true
    rerender(
      <CheckboxField
        name="test-checkbox"
        label="Test Label"
        checked={true}
        onChange={onChange}
      />
    )
    
    // Segundo click - cambia a false
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith('test-checkbox', false)
    
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
