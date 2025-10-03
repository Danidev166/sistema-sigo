import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ValidatedInput from '../ui/ValidatedInput';

describe('ValidatedInput', () => {
  const defaultProps = {
    label: 'Test Input',
    value: '',
    onChange: vi.fn(),
    placeholder: 'Enter text...'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label and placeholder', () => {
    render(<ValidatedInput {...defaultProps} />);
    
    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('shows error state when error prop is provided', () => {
    render(<ValidatedInput {...defaultProps} error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('shows success state when success prop is provided and has value', () => {
    render(
      <ValidatedInput 
        {...defaultProps} 
        value="test value" 
        success="Valid input" 
      />
    );
    
    expect(screen.getByText('Valid input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500');
  });

  it('shows required asterisk when required prop is true', () => {
    render(<ValidatedInput {...defaultProps} required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<ValidatedInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('shows help text when provided', () => {
    render(<ValidatedInput {...defaultProps} helpText="This is help text" />);
    
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<ValidatedInput {...defaultProps} disabled />);
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows password toggle when showPasswordToggle is true and type is password', () => {
    render(
      <ValidatedInput 
        {...defaultProps} 
        type="password" 
        showPasswordToggle 
      />
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles password visibility when toggle button is clicked', () => {
    render(
      <ValidatedInput 
        {...defaultProps} 
        type="password" 
        showPasswordToggle 
      />
    );
    
    const toggleButton = screen.getByRole('button');
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
