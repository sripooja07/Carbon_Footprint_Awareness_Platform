import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

describe('Select component', () => {
  const mockOptions = [
    { value: 'cat1', label: 'Category One' },
    { value: 'cat2', label: 'Category Two' }
  ];

  it('renders label and description correctly', () => {
    render(
      <Select 
        id="test-select" 
        label="Dropdown Label" 
        description="Select description context"
        options={mockOptions} 
      />
    );

    expect(screen.getByText('Dropdown Label')).toBeInTheDocument();
    expect(screen.getByText('Select description context')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select id="test-select" label="Select Label" options={mockOptions} />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(2);
    expect(options[0]).toHaveValue('cat1');
    expect(options[0]).toHaveTextContent('Category One');
  });

  it('calls onChange handler when an option is selected', () => {
    const handleChange = vi.fn();
    render(
      <Select 
        id="test-select" 
        label="Select Label" 
        value="cat1" 
        onChange={handleChange} 
        options={mockOptions} 
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cat2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
