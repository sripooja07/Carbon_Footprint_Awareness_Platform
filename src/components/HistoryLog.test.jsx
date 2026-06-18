import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryLog from './HistoryLog';

const mockLogs = [
  { id: 'log_1', category: 'transport', type: 'car_petrol', co2: 25.5, details: '150 km petrol car', date: '2026-06-10' },
  { id: 'log_2', category: 'energy', type: 'electricity_grid', co2: 49.2, details: '120 kWh electricity', date: '2026-06-11' }
];

describe('HistoryLog Component', () => {
  it('should render log tables and ledger panel headers', () => {
    render(<HistoryLog logs={mockLogs} onDeleteLog={vi.fn()} />);

    expect(screen.getByText('Log History')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-card')).toBeInTheDocument();
    expect(screen.getByText('150 km petrol car')).toBeInTheDocument();
    expect(screen.getByText('120 kWh electricity')).toBeInTheDocument();
  });

  it('should render the custom SVG trend graph when multiple logs exist', () => {
    render(<HistoryLog logs={mockLogs} onDeleteLog={vi.fn()} />);

    expect(screen.getByTestId('trend-card')).toBeInTheDocument();
    expect(screen.getByLabelText(/Weekly carbon emissions trend graph/i)).toBeInTheDocument();
  });

  it('should display table columns header details', () => {
    render(<HistoryLog logs={mockLogs} onDeleteLog={vi.fn()} />);

    expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Carbon CO₂e' })).toBeInTheDocument();
  });

  it('should trigger onDeleteLog callback with log ID when delete action is clicked', () => {
    const mockDelete = vi.fn();
    render(<HistoryLog logs={mockLogs} onDeleteLog={mockDelete} />);

    // Click delete on log_1 row
    const deleteBtn = screen.getByTestId('delete-btn-log_1');
    fireEvent.click(deleteBtn);

    expect(mockDelete).toHaveBeenCalledWith('log_1');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('should render empty state graphic and instructions when no logs are passed', () => {
    render(<HistoryLog logs={[]} onDeleteLog={vi.fn()} />);

    expect(screen.getByText('No activities logged yet')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
