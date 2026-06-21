import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
  it('renders children correctly', () => {
    render(<Card>Card Body Content</Card>);
    expect(screen.getByText('Card Body Content')).toBeInTheDocument();
  });

  it('renders header items when title/icon are provided', () => {
    render(
      <Card 
        title="Metric Card" 
        icon={<span data-testid="card-icon">🍃</span>} 
        action={<button data-testid="card-action">More</button>}
      >
        Content
      </Card>
    );

    expect(screen.getByText('Metric Card')).toBeInTheDocument();
    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    expect(screen.getByTestId('card-action')).toBeInTheDocument();
  });

  it('does not render header bar if no title, icon, or action is passed', () => {
    const { container } = render(<Card>Body Only</Card>);
    const headers = container.querySelectorAll('.flex-between');
    expect(headers.length).toBe(0);
  });
});
