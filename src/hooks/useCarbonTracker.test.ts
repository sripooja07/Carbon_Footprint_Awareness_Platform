import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCarbonTracker } from './useCarbonTracker';

describe('useCarbonTracker hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes logs and active challenges with seed defaults', () => {
    const { result } = renderHook(() => useCarbonTracker());
    expect(result.current.logs.length).toBe(4);
    expect(result.current.activeChallenges).toContain('challenge_meatless');
    expect(result.current.completedChallenges.length).toBe(0);
    expect(result.current.totalOffsetSavings).toBe(0);
  });

  it('adds activity logs and sanitizes input to neutralize HTML scripts', () => {
    const { result } = renderHook(() => useCarbonTracker());

    act(() => {
      result.current.addLog({
        id: 'user_log_1',
        date: '2026-06-18',
        category: 'transport',
        type: 'car_petrol',
        amount: 50.556,
        co2: 12.34567,
        details: 'Commute <script>alert("xss")</script>'
      });
    });

    expect(result.current.logs[0]).toEqual({
      id: 'user_log_1',
      date: '2026-06-18',
      category: 'transport',
      type: 'car_petrol',
      amount: 50.56,
      co2: 12.3457,
      details: 'Commute scriptalert("xss")/script'
    });
  });

  it('falls back to safe default parameters if invalid inputs are logged', () => {
    const { result } = renderHook(() => useCarbonTracker());

    act(() => {
      result.current.addLog({
        id: 'bad@id',
        date: 'invalid-date',
        category: 'unknown-cat' as any,
        co2: NaN,
        amount: NaN,
        details: undefined
      });
    });

    const added = result.current.logs[0];
    expect(added.id).toBe('badid');
    expect(added.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(added.category).toBe('transport');
    expect(added.co2).toBe(0);
    expect(added.amount).toBe(0);
    expect(added.details).toBe('');
  });

  it('deletes activity logs by id', () => {
    const { result } = renderHook(() => useCarbonTracker());
    const initialLength = result.current.logs.length;
    const targetId = result.current.logs[0].id;

    act(() => {
      result.current.deleteLog(targetId);
    });

    expect(result.current.logs.length).toBe(initialLength - 1);
    expect(result.current.logs.find(l => l.id === targetId)).toBeUndefined();
  });

  it('commits, completes, and cancels challenges', () => {
    const { result } = renderHook(() => useCarbonTracker());

    // 1. Commit/accept a challenge
    act(() => {
      result.current.acceptChallenge('challenge_recycle');
    });
    expect(result.current.activeChallenges).toContain('challenge_recycle');

    // 2. Complete the challenge
    act(() => {
      result.current.completeChallenge('challenge_recycle');
    });
    expect(result.current.activeChallenges).not.toContain('challenge_recycle');
    expect(result.current.completedChallenges).toContain('challenge_recycle');
    expect(result.current.totalOffsetSavings).toBe(6.0); // savings for zero waste hero is 6.0 kg

    // 3. Confirm offset activity log entry was logged
    expect(result.current.logs[0].co2).toBe(-6.0);
    expect(result.current.logs[0].type).toBe('offset');

    // 4. Cancel/quit an active challenge
    act(() => {
      result.current.acceptChallenge('challenge_unplug');
    });
    expect(result.current.activeChallenges).toContain('challenge_unplug');

    act(() => {
      result.current.cancelChallenge('challenge_unplug');
    });
    expect(result.current.activeChallenges).not.toContain('challenge_unplug');
  });

  it('does nothing when completing non-existent challenges', () => {
    const { result } = renderHook(() => useCarbonTracker());
    const initialActive = result.current.activeChallenges;
    const initialCompleted = result.current.completedChallenges;

    act(() => {
      result.current.completeChallenge('invalid_challenge');
    });

    expect(result.current.activeChallenges).toEqual(initialActive);
    expect(result.current.completedChallenges).toEqual(initialCompleted);
  });
});
