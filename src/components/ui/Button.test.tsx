import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct CSS class for variant', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button).toHaveClass('btn-secondary');

    rerender(<Button variant="danger">Danger</Button>);
    expect(button).toHaveClass('btn-danger');
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies standard aria-label attributes', () => {
    render(<Button ariaLabel="custom label">Icon Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'custom label');
  });
});
