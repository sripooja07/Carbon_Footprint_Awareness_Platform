import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Recommendations from './Recommendations';

const mockChallenges = [
  { id: 'challenge_meatless', title: 'Meatless Week', co2Savings: 24.0, difficulty: 'Medium', description: 'Vegetarian', category: 'food', duration: '7 days' },
  { id: 'challenge_carfree', title: 'Car-Free Commute', co2Savings: 5.1, difficulty: 'Medium', description: 'Walk or bike', category: 'transport', duration: '30 days' }
];

const mockLogs = [
  { id: 'log_1', category: 'transport', type: 'car_petrol', co2: 150.0, details: 'Drive' }
];

describe('Recommendations Component', () => {
  it('should render header titles and default info insights if logs are empty', () => {
    render(
      <Recommendations 
        logs={[]}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={vi.fn()}
        onCompleteChallenge={vi.fn()}
        onCancelChallenge={vi.fn()}
      />
    );

    expect(screen.getByText('Personalized Insights')).toBeInTheDocument();
    expect(screen.getByText('Start Tracking to Unlock Insights')).toBeInTheDocument();
  });

  it('should render warning insights about transportation if travel emissions are highest', () => {
    render(
      <Recommendations 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={vi.fn()}
        onCompleteChallenge={vi.fn()}
        onCancelChallenge={vi.fn()}
      />
    );

    expect(screen.getByText(/Transportation is your largest source of emissions/i)).toBeInTheDocument();
  });

  it('should render challenge cards with Accept buttons for uncommitted goals', () => {
    const mockAccept = vi.fn();
    render(
      <Recommendations 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={mockAccept}
        onCompleteChallenge={vi.fn()}
        onCancelChallenge={vi.fn()}
      />
    );

    expect(screen.getByText('Meatless Week')).toBeInTheDocument();
    
    const acceptBtn = screen.getByRole('button', { name: 'Commit to challenge: Meatless Week' });
    fireEvent.click(acceptBtn);
    expect(mockAccept).toHaveBeenCalledWith('challenge_meatless');
  });

  it('should render Quit and Done buttons for active challenges', () => {
    const mockCancel = vi.fn();
    const mockComplete = vi.fn();
    
    render(
      <Recommendations 
        logs={mockLogs}
        activeChallenges={['challenge_meatless']}
        completedChallenges={[]}
        challenges={mockChallenges}
        onAcceptChallenge={vi.fn()}
        onCompleteChallenge={mockComplete}
        onCancelChallenge={mockCancel}
      />
    );

    const quitBtn = screen.getByRole('button', { name: 'Quit challenge: Meatless Week' });
    const doneBtn = screen.getByRole('button', { name: 'Complete challenge: Meatless Week' });

    fireEvent.click(quitBtn);
    expect(mockCancel).toHaveBeenCalledWith('challenge_meatless');

    fireEvent.click(doneBtn);
    expect(mockComplete).toHaveBeenCalledWith('challenge_meatless');
  });

  it('should render Completed badge for completed challenges', () => {
    render(
      <Recommendations 
        logs={mockLogs}
        activeChallenges={[]}
        completedChallenges={['challenge_meatless']}
        challenges={mockChallenges}
        onAcceptChallenge={vi.fn()}
        onCompleteChallenge={vi.fn()}
        onCancelChallenge={vi.fn()}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Commit to challenge: Meatless Week' })).not.toBeInTheDocument();
  });
});

