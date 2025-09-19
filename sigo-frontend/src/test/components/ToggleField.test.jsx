import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import ToggleField from '../../components/ui/ToggleField'

describe('ToggleField Component', () => {
  it('renders toggle with label', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
      />
    )
    
    expect(screen.getByText('Test Toggle')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('handles toggle state changes', () => {
    const handleChange = vi.fn()
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={handleChange}
      />
    )
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(handleChange).toHaveBeenCalledWith('test-toggle', true)
  })

  it('shows checked state correctly', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={true}
        onChange={vi.fn()}
      />
    )
    
    const toggle = screen.getByRole('switch')
    expect(toggle).toBeChecked()
  })

  it('can be disabled', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
        disabled={true}
      />
    )
    
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies custom className', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
        className="custom-class"
      />
    )
    
    const container = screen.getByText('Test Toggle').closest('div')?.parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('shows description when provided', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
        description="This is a test toggle"
      />
    )
    
    // Check if description is rendered
    expect(screen.getByText('This is a test toggle')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
      />
    )
    
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('updates aria-checked when state changes', () => {
    const { rerender } = render(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={false}
        onChange={vi.fn()}
      />
    )
    
    let toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    
    rerender(
      <ToggleField
        label="Test Toggle"
        name="test-toggle"
        checked={true}
        onChange={vi.fn()}
      />
    )
    
    toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
})
