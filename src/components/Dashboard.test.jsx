import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

const mockChallenges = [
  { id: 'challenge_meatless', title: 'Meatless Week', co2Savings: 24.0, difficulty: 'Medium', description: 'Vegetarian' },
  { id: 'challenge_carfree', title: 'Car-Free Commute', co2Savings: 5.1, difficulty: 'Medium', description: 'Walk or bike' }
];

const mockLogs = [
  { id: 'log_1', category: 'transport', type: 'car_petrol', co2: 25.5, details: '150 km petrol car' },
  { id: 'log_2', category: 'energy', type: 'electricity_grid', co2: 49.2, details: '120 kWh electricity' }
];

describe('Dashboard Component', () => {
  it('should render Dashboard headers and key visual cards', () => {
    const mockSetPage = vi.fn();
    render(
      <Dashboard 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={mockSetPage}
      />
    );

    expect(screen.getByText('My Eco-Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('emitted-card')).toBeInTheDocument();
    expect(screen.getByTestId('saved-card')).toBeInTheDocument();
    expect(screen.getByTestId('rank-card')).toBeInTheDocument();
  });

  it('should display the correct net emitted emissions total', () => {
    render(
      <Dashboard 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={vi.fn()}
      />
    );

    // net emission = 25.5 + 49.2 = 74.7 kg
    expect(screen.getByText('74.7')).toBeInTheDocument();
    expect(screen.getByText('Eco Champion (Within Budget)')).toBeInTheDocument();
  });

  it('should trigger warnings if carbon budget is exceeded', () => {
    // 350 kg is the budget, let's create a huge emission log
    const highLogs = [
      { id: 'log_heavy', category: 'energy', type: 'heating_oil', co2: 400.0, details: 'Heating oil usage' }
    ];

    render(
      <Dashboard 
        logs={highLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={vi.fn()}
      />
    );

    expect(screen.getByText('Carbon Budget Exceeded')).toBeInTheDocument();
  });

  it('should display active challenges list', () => {
    render(
      <Dashboard 
        logs={mockLogs}
        activeChallenges={['challenge_meatless']}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={vi.fn()}
      />
    );

    expect(screen.getByText('Meatless Week')).toBeInTheDocument();
  });

  it('should show empty state message if there are no active challenges', () => {
    render(
      <Dashboard 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={vi.fn()}
      />
    );

    expect(screen.getByText(/No active challenges!/i)).toBeInTheDocument();
  });

  it('should trigger setPage navigation callback when button is clicked', () => {
    const mockSetPage = vi.fn();
    render(
      <Dashboard 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={mockSetPage}
      />
    );

    const browseBtn = screen.getByRole('button', { name: 'Browse all challenges' });
    fireEvent.click(browseBtn);
    expect(mockSetPage).toHaveBeenCalledWith('insights');
  });
});
