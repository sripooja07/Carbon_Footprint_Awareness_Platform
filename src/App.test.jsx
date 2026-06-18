import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Root Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render sidebar header branding and load Dashboard by default', async () => {
    render(<App />);

    // Sidebar logo texts (mobile header & sidebar)
    const logoTexts = screen.getAllByText('Eco Friendly Tracker');
    expect(logoTexts.length).toBeGreaterThan(0);
    
    // Wait for lazy loaded Dashboard to be rendered
    const dashboardTitle = await screen.findByText('My Eco-Dashboard');
    expect(dashboardTitle).toBeInTheDocument();
  });

  it('should navigate between views correctly upon sidebar button clicks', async () => {
    render(<App />);

    // Wait for initial lazy dashboard load
    await screen.findByText('My Eco-Dashboard');

    // Click "Track Emissions" in sidebar
    const trackBtn = screen.getByRole('button', { name: /Track Emissions/i });
    fireEvent.click(trackBtn);

    // Wait for Calculator view to render
    const trackTitle = await screen.findByText('Track Emissions');
    expect(trackTitle).toBeInTheDocument();

    // Click "Challenges & Tips"
    const tipsBtn = screen.getByRole('button', { name: /Challenges & Tips/i });
    fireEvent.click(tipsBtn);

    // Wait for Recommendations view to render
    const tipsTitle = await screen.findByText('Personalized Insights');
    expect(tipsTitle).toBeInTheDocument();

    // Click "Log History"
    const historyBtn = screen.getByRole('button', { name: /Log History/i });
    fireEvent.click(historyBtn);

    // Wait for HistoryLog view to render
    const historyTitle = await screen.findByText('Log History');
    expect(historyTitle).toBeInTheDocument();
  });
});
