import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock subcomponents to avoid lazy loading hurdles in unit testing
vi.mock('./components/Dashboard', () => ({
  default: ({ setPage }: { setPage: (p: string) => void }) => (
    <div data-testid="dashboard-mock">
      Dashboard Panel
      <button onClick={() => setPage('insights')}>Go To Insights</button>
    </div>
  )
}));
vi.mock('./components/Calculator', () => ({
  default: () => <div data-testid="calculator-mock">Calculator Panel</div>
}));
vi.mock('./components/Recommendations', () => ({
  default: () => <div data-testid="recommendations-mock">Recommendations Panel</div>
}));
vi.mock('./components/HistoryLog', () => ({
  default: () => <div data-testid="history-mock">History Panel</div>
}));

describe('App Root Layout', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders side navigation and defaults to the dashboard view', async () => {
    render(<App />);

    // Sidebar Title
    expect(screen.getAllByText('Eco Friendly Tracker')[0]).toBeInTheDocument();

    // Verify Dashboard shows up
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();
    });
  });

  it('navigates to different pages when navigation buttons are clicked', async () => {
    render(<App />);

    // Wait for initial dashboard load
    await screen.findByTestId('dashboard-mock');

    // Click on Track Emissions tab
    const trackBtn = screen.getByRole('button', { name: /Track Emissions/i });
    fireEvent.click(trackBtn);
    await screen.findByTestId('calculator-mock');

    // Click on Challenges & Tips tab
    const insightsBtn = screen.getByRole('button', { name: /Challenges & Tips/i });
    fireEvent.click(insightsBtn);
    await screen.findByTestId('recommendations-mock');

    // Click on Log History tab
    const historyBtn = screen.getByRole('button', { name: /Log History/i });
    fireEvent.click(historyBtn);
    await screen.findByTestId('history-mock');
  });

  it('toggles mobile sidebar menu overlay correctly', async () => {
    render(<App />);

    const openBtn = screen.getByRole('button', { name: /Open navigation menu/i });
    fireEvent.click(openBtn);
    expect(screen.getByRole('button', { name: /Close navigation menu/i })).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close navigation menu/i });
    fireEvent.click(closeBtn);
    expect(screen.getByRole('button', { name: /Open navigation menu/i })).toBeInTheDocument();
  });

  it('responds to nested setPage callback from subcomponents', async () => {
    render(<App />);
    
    await screen.findByTestId('dashboard-mock');
    
    // Click navigation button inside mock dashboard
    const navigateBtn = screen.getByRole('button', { name: 'Go To Insights' });
    fireEvent.click(navigateBtn);
    
    await screen.findByTestId('recommendations-mock');
  });
});
