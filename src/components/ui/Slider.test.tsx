import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Slider from './Slider';

describe('Slider component', () => {
  it('renders label, initial value badge and boundaries correctly', () => {
    render(
      <Slider 
        id="test-slider" 
        label="Distance Slider" 
        min={0} 
        max={100} 
        step={5} 
        value={25} 
        unit="km" 
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Distance Slider')).toBeInTheDocument();
    expect(screen.getByTestId('test-slider-badge')).toHaveTextContent('25 km');
    expect(screen.getByText('0 km')).toBeInTheDocument();
    expect(screen.getByText('100 km')).toBeInTheDocument();
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '5');
    expect(slider).toHaveValue('25');
  });

  it('calls onChange handler when slider is dragged/changed', () => {
    const handleChange = vi.fn();
    render(
      <Slider 
        id="test-slider" 
        label="Distance" 
        min={0} 
        max={100} 
        value={25} 
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByRole('slider'), { target: { value: '50' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
