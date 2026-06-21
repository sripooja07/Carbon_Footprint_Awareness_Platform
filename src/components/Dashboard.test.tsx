import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { LogEntry, Challenge } from '../types';

describe('Dashboard Component', () => {
  const mockChallenges: Challenge[] = [
    {
      id: 'ch_1',
      title: 'Green Commuting',
      description: 'Ride bus instead of petrol car',
      category: 'transport',
      co2Savings: 15.0,
      difficulty: 'Easy',
      duration: '7 days'
    },
    {
      id: 'ch_2',
      title: 'Eat Veggies',
      description: 'Go vegetarian',
      category: 'food',
      co2Savings: 50.0,
      difficulty: 'Medium',
      duration: '5 days'
    }
  ];

  const mockLogs: LogEntry[] = [
    { id: '1', date: '2026-06-18', category: 'transport', co2: 120, type: 'car_petrol', details: 'petrol car ride', amount: 300 },
    { id: '2', date: '2026-06-18', category: 'energy', co2: 150, type: 'electricity_grid', details: 'grid electricity', amount: 300 },
  ];

  it('renders stats and gauges correctly with valid activities log data', () => {
    const handleSetPage = vi.fn();
    render(
      <Dashboard
        logs={mockLogs}
        activeChallenges={['ch_1']}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={handleSetPage}
      />
    );

    expect(screen.getByText('Carbon Emitted')).toBeInTheDocument();
    expect(screen.getByText('270.0')).toBeInTheDocument(); // total = 120 + 150 = 270
    expect(screen.getByText('Carbon Saved')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
    
    // Check rank
    expect(screen.getByText('Eco Novice')).toBeInTheDocument();

    // Check budget limit progress
    expect(screen.getByText('Approaching Budget Limit')).toBeInTheDocument(); // 200 is > 350 * 0.75 (262.5)
  });

  it('adjusts rank and budget status text for high carbon and high savings', () => {
    // 400 emitted, 100 saved
    const highLogs: LogEntry[] = [
      { id: '1', date: '2026-06-18', category: 'food', co2: 400, type: 'heavy_meat', details: 'diet', amount: 30 }
    ];
    render(
      <Dashboard
        logs={highLogs}
        activeChallenges={[]}
        completedChallenges={['ch_2']}
        challenges={mockChallenges}
        setPage={() => {}}
      />
    );

    expect(screen.getByText('Carbon Budget Exceeded')).toBeInTheDocument();
    expect(screen.getByText('Eco Conscious')).toBeInTheDocument(); // 50 saved (between 20 and 80)
  });

  it('triggers page navigation callback when clicking Browse Challenges button', () => {
    const handleSetPage = vi.fn();
    render(
      <Dashboard
        logs={[]}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={handleSetPage}
      />
    );

    const browseBtn = screen.getByRole('button', { name: 'Browse all challenges' });
    fireEvent.click(browseBtn);
    expect(handleSetPage).toHaveBeenCalledWith('insights');
  });

  it('renders active challenges details correctly', () => {
    render(
      <Dashboard
        logs={[]}
        activeChallenges={['ch_1']}
        completedChallenges={[]}
        challenges={mockChallenges}
        setPage={() => {}}
      />
    );

    expect(screen.getByText('Green Commuting')).toBeInTheDocument();
    expect(screen.getByText('Save 15 kg')).toBeInTheDocument();
  });
});
