import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Recommendations from './Recommendations';
import { LogEntry, Challenge } from '../types';

describe('Recommendations Component', () => {
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

  it('renders welcome insights panel when there are no logged activities', () => {
    render(
      <Recommendations
        logs={[]}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={() => {}}
        onCompleteChallenge={() => {}}
        onCancelChallenge={() => {}}
      />
    );

    expect(screen.getByText('Start Tracking to Unlock Insights')).toBeInTheDocument();
    expect(screen.getByText(/Add logs on the 'Track' tab/)).toBeInTheDocument();
  });

  it('provides a custom suggestion when transportation emissions are highest', () => {
    const logs: LogEntry[] = [
      { id: '1', date: '2026-06-18', category: 'transport', co2: 80, type: 'car_petrol', details: 'drive', amount: 470 },
      { id: '2', date: '2026-06-18', category: 'food', co2: 20, type: 'medium_meat', details: 'diet', amount: 7 }
    ];
    render(
      <Recommendations
        logs={logs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={() => {}}
        onCompleteChallenge={() => {}}
        onCancelChallenge={() => {}}
      />
    );

    expect(screen.getByText('Transportation is your largest source of emissions')).toBeInTheDocument();
    expect(screen.getByText(/Your travel accounts for 80%/)).toBeInTheDocument();
  });

  it('provides a custom suggestion when energy emissions are highest', () => {
    const logs: LogEntry[] = [
      { id: '1', date: '2026-06-18', category: 'energy', co2: 90, type: 'electricity_grid', details: 'bills', amount: 220 },
      { id: '2', date: '2026-06-18', category: 'food', co2: 10, type: 'medium_meat', details: 'diet', amount: 2 }
    ];
    render(
      <Recommendations
        logs={logs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={() => {}}
        onCompleteChallenge={() => {}}
        onCancelChallenge={() => {}}
      />
    );

    expect(screen.getByText('Home Energy consumption is dominating your score')).toBeInTheDocument();
  });

  it('provides a custom suggestion when food emissions are highest', () => {
    const logs: LogEntry[] = [
      { id: '1', date: '2026-06-18', category: 'food', co2: 90, type: 'heavy_meat', details: 'meat', amount: 12 },
      { id: '2', date: '2026-06-18', category: 'shopping', co2: 10, type: 'clothing_item', details: 'buy', amount: 1 }
    ];
    render(
      <Recommendations
        logs={logs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={() => {}}
        onCompleteChallenge={() => {}}
        onCancelChallenge={() => {}}
      />
    );

    expect(screen.getByText('Your Diet has the highest carbon contribution')).toBeInTheDocument();
  });

  it('provides a custom suggestion when shopping emissions are highest', () => {
    const logs: LogEntry[] = [
      { id: '1', date: '2026-06-18', category: 'shopping', co2: 80, type: 'laptop', details: 'laptop purchase', amount: 1 },
      { id: '2', date: '2026-06-18', category: 'transport', co2: 20, type: 'car_petrol', details: 'trip', amount: 110 }
    ];
    render(
      <Recommendations
        logs={logs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={() => {}}
        onCompleteChallenge={() => {}}
        onCancelChallenge={() => {}}
      />
    );

    expect(screen.getByText('Shopping and Landfill waste are driving your footprint')).toBeInTheDocument();
  });

  it('calls callback functions when clicking Accept, Quit, and Done buttons', () => {
    const handleAccept = vi.fn();
    const handleComplete = vi.fn();
    const handleCancel = vi.fn();

    const { rerender } = render(
      <Recommendations
        logs={[]}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={handleAccept}
        onCompleteChallenge={handleComplete}
        onCancelChallenge={handleCancel}
      />
    );

    // Accept challenge
    const acceptBtn = screen.getByRole('button', { name: 'Commit to challenge: Green Commuting' });
    fireEvent.click(acceptBtn);
    expect(handleAccept).toHaveBeenCalledWith('ch_1');

    // Rerender with active challenge
    rerender(
      <Recommendations
        logs={[]}
        activeChallenges={['ch_1']}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={handleAccept}
        onCompleteChallenge={handleComplete}
        onCancelChallenge={handleCancel}
      />
    );

    const quitBtn = screen.getByRole('button', { name: 'Quit challenge: Green Commuting' });
    const doneBtn = screen.getByRole('button', { name: 'Complete challenge: Green Commuting' });

    fireEvent.click(quitBtn);
    expect(handleCancel).toHaveBeenCalledWith('ch_1');

    fireEvent.click(doneBtn);
    expect(handleComplete).toHaveBeenCalledWith('ch_1');

    // Rerender with completed challenge
    rerender(
      <Recommendations
        logs={[]}
        activeChallenges={[]}
        completedChallenges={['ch_1']}
        challenges={mockChallenges}
        onAcceptChallenge={handleAccept}
        onCompleteChallenge={handleComplete}
        onCancelChallenge={handleCancel}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
