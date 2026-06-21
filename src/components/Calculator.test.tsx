import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator Component', () => {
  it('renders correctly and defaults to transport tab', () => {
    render(<Calculator onAddLog={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Transport' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/Transportation Mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Distance Traveled/i)).toBeInTheDocument();
    
    // Live estimate banner
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('8.5 kg CO₂e'); // default car_petrol (0.17) * 50 = 8.5
  });

  it('switches tabs correctly and updates live estimates', () => {
    render(<Calculator onAddLog={() => {}} />);

    // Switch to Energy tab
    const energyTab = screen.getByRole('tab', { name: 'Energy' });
    fireEvent.click(energyTab);
    expect(energyTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/Energy Source/i)).toBeInTheDocument();
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('61.5 kg CO₂e'); // standard grid electricity (0.41) * 150 = 61.5

    // Switch to Diet & Food tab
    const foodTab = screen.getByRole('tab', { name: 'Diet & Food' });
    fireEvent.click(foodTab);
    expect(foodTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Diet Profile')).toBeInTheDocument();
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('39.4 kg CO₂e'); // medium_meat (5.63) * 7 = 39.4

    // Switch to Shopping & Waste tab
    const shoppingTab = screen.getByRole('tab', { name: 'Shopping & Waste' });
    fireEvent.click(shoppingTab);
    expect(shoppingTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('25.0 kg CO₂e'); // clothing_item (12.5) * 2 = 25.0
  });

  it('handles input updates, updates live estimates, and submits successfully', async () => {
    vi.useFakeTimers();
    const handleAddLog = vi.fn();
    render(<Calculator onAddLog={handleAddLog} />);

    // Modify transport distance slider
    const distanceSlider = screen.getByLabelText(/Distance Traveled/i);
    fireEvent.change(distanceSlider, { target: { value: '100' } });
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('17.0 kg CO₂e'); // car_petrol (0.17) * 100 = 17.0

    // Submit form directly
    const form = screen.getByTestId('emissions-form');
    fireEvent.submit(form);

    expect(handleAddLog).toHaveBeenCalledTimes(1);
    expect(handleAddLog).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'transport',
        co2: 17.0,
        type: 'car_petrol',
        amount: 100,
        details: '100 km via Petrol Car'
      })
    );

    // Toast check
    expect(screen.getByRole('status')).toHaveTextContent('Logged Successfully!');
    expect(screen.getByRole('status')).toHaveTextContent('Added 100 km via Petrol Car');

    // Advance timers to close toast
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByRole('status')).toBeNull();
    vi.useRealTimers();
  });

  it('displays form error validation for invalid boundaries (distance < 1)', () => {
    const handleAddLog = vi.fn();
    render(<Calculator onAddLog={handleAddLog} />);

    // Distance 0
    const distanceSlider = screen.getByLabelText(/Distance Traveled/i);
    distanceSlider.setAttribute('min', '-5');
    fireEvent.change(distanceSlider, { target: { value: '0' } });

    const form = screen.getByTestId('emissions-form');
    fireEvent.submit(form);

    expect(screen.getByRole('alert')).toHaveTextContent('Travel distance must be at least 1 km.');
    expect(handleAddLog).not.toHaveBeenCalled();
  });

  it('displays form error validation on energy tab (amount < 1)', () => {
    const handleAddLog = vi.fn();
    render(<Calculator onAddLog={handleAddLog} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Energy' }));
    
    // Usage Amount slider set to 0
    const usageSlider = screen.getByLabelText(/Usage Amount/i);
    usageSlider.setAttribute('min', '-5');
    fireEvent.change(usageSlider, { target: { value: '0' } });

    fireEvent.submit(screen.getByTestId('emissions-form'));

    expect(screen.getByRole('alert')).toHaveTextContent('Energy amount must be at least 1 unit.');
    expect(handleAddLog).not.toHaveBeenCalled();
  });

  it('displays form error validation on food tab (duration > 30)', () => {
    const handleAddLog = vi.fn();
    render(<Calculator onAddLog={handleAddLog} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Diet & Food' }));

    // Duration slider set to 35
    const durationSlider = screen.getByLabelText(/Duration/i);
    durationSlider.setAttribute('max', '50');
    fireEvent.change(durationSlider, { target: { value: '35' } });

    fireEvent.submit(screen.getByTestId('emissions-form'));

    expect(screen.getByRole('alert')).toHaveTextContent('Duration must be between 1 and 30 days.');
    expect(handleAddLog).not.toHaveBeenCalled();
  });

  it('displays form error validation on shopping tab (qty > 10)', () => {
    const handleAddLog = vi.fn();
    render(<Calculator onAddLog={handleAddLog} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Shopping & Waste' }));

    // Quantity slider set to 15
    const qtySlider = screen.getByLabelText(/Quantity/i);
    qtySlider.setAttribute('max', '20');
    fireEvent.change(qtySlider, { target: { value: '15' } });

    fireEvent.submit(screen.getByTestId('emissions-form'));

    expect(screen.getByRole('alert')).toHaveTextContent('Quantity must be between 1 and 10.');
    expect(handleAddLog).not.toHaveBeenCalled();
  });

  it('updates form and switches radio cards on food tab', () => {
    render(<Calculator onAddLog={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Diet & Food' }));

    const veganRadio = screen.getByLabelText(/vegan/i);
    fireEvent.click(veganRadio);
    
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('20.2 kg CO₂e'); // vegan (2.89) * 7 = 20.23 (20.2)
  });
});
