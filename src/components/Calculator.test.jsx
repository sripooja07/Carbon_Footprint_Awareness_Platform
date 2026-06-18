import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator Component', () => {
  it('should render core navigation tabs and default transport form fields', () => {
    render(<Calculator onAddLog={vi.fn()} />);

    expect(screen.getByRole('tab', { name: /Transport/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Energy/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Diet & Food/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Shopping/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/Transportation Mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Distance Traveled/i)).toBeInTheDocument();
  });

  it('should switch form panels upon tab clicks', async () => {
    render(<Calculator onAddLog={vi.fn()} />);

    const energyTab = screen.getByRole('tab', { name: /Energy/i });
    fireEvent.click(energyTab);

    expect(screen.getByLabelText(/Energy Source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usage Amount/i)).toBeInTheDocument();
  });

  it('should recalculate live carbon estimates in real-time as sliders slide', () => {
    render(<Calculator onAddLog={vi.fn()} />);

    const distanceSlider = screen.getByLabelText(/Distance Traveled/i);
    // Let's slide it to 100km
    fireEvent.change(distanceSlider, { target: { value: '100' } });

    // Petrol car coefficient is 0.17. 100 * 0.17 = 17 kg
    expect(screen.getByTestId('live-estimate')).toHaveTextContent('17.0 kg CO₂e');
  });

  it("should display error alerts if validation constraints are violated on submit", () => {
    render(<Calculator onAddLog={vi.fn()} />);

    // Clear date field to trigger validation error
    const dateInput = screen.getByLabelText(/Select Activity Date/i);
    fireEvent.change(dateInput, { target: { value: "" } });

    const form = screen.getByTestId("emissions-form");
    fireEvent.submit(form);

    expect(screen.getByRole("alert")).toHaveTextContent("Please select a valid date.");
  });

  it("should call onAddLog with a valid payload upon successful form submissions", () => {
    const mockAddLog = vi.fn();
    render(<Calculator onAddLog={mockAddLog} />);

    // Trigger form submit
    const form = screen.getByTestId("emissions-form");
    fireEvent.submit(form);

    expect(mockAddLog).toHaveBeenCalledTimes(1);
    const payload = mockAddLog.mock.calls[0][0];
    expect(payload).toHaveProperty("id");
    expect(payload.category).toBe("transport");
    expect(payload.amount).toBe(50);
    // petrol car: 50 * 0.17 = 8.5 kg
    expect(payload.co2).toBe(8.5);
  });
});

