import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryLog from './HistoryLog';
import { LogEntry } from '../types';

describe('HistoryLog Component', () => {
  const mockLogs: LogEntry[] = [
    { id: '1', date: '2026-06-10', category: 'transport', co2: 25.5, type: 'car_petrol', details: '150 km via Petrol Car', amount: 150 },
    { id: '2', date: '2026-06-12', category: 'energy', co2: 49.2, type: 'electricity_grid', details: '120 kWh of Grid Electricity', amount: 120 }
  ];

  it('renders empty state correctly when there are no logged activities', () => {
    render(<HistoryLog logs={[]} onDeleteLog={() => {}} />);
    expect(screen.getByText('No activities logged yet')).toBeInTheDocument();
    expect(screen.getByText('Need logs across multiple dates to render trend comparison.')).toBeInTheDocument();
  });

  it('renders emissions trend line graph and ledger table correctly when activities exist', () => {
    render(<HistoryLog logs={mockLogs} onDeleteLog={() => {}} />);

    // Check header & table elements
    expect(screen.getByText('Log History')).toBeInTheDocument();
    expect(screen.getByText('Activity Log Ledger')).toBeInTheDocument();
    expect(screen.getByText('150 km via Petrol Car')).toBeInTheDocument();
    expect(screen.getByText('+25.5 kg')).toBeInTheDocument();
    expect(screen.getByText('120 kWh of Grid Electricity')).toBeInTheDocument();
    expect(screen.getByText('+49.2 kg')).toBeInTheDocument();

    // Check SVG graph
    expect(screen.getByLabelText(/Weekly carbon emissions trend graph/)).toBeInTheDocument();
  });

  it('triggers onDeleteLog callback when clicking the delete activity button', () => {
    const handleDeleteLog = vi.fn();
    render(<HistoryLog logs={mockLogs} onDeleteLog={handleDeleteLog} />);

    const deleteBtn = screen.getByTestId('delete-btn-1');
    fireEvent.click(deleteBtn);

    expect(handleDeleteLog).toHaveBeenCalledTimes(1);
    expect(handleDeleteLog).toHaveBeenCalledWith('1');
  });
});
