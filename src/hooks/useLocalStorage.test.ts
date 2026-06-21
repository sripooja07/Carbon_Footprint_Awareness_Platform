import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    expect(result.current[0]).toBe('default_val');
    expect(window.localStorage.getItem('test_key')).toBeNull();
  });

  it('loads existing value from localStorage', () => {
    window.localStorage.setItem('test_key', JSON.stringify('saved_val'));
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    expect(result.current[0]).toBe('saved_val');
  });

  it('sets value and syncs it with localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    
    act(() => {
      result.current[1]('new_val');
    });

    expect(result.current[0]).toBe('new_val');
    expect(window.localStorage.getItem('test_key')).toBe(JSON.stringify('new_val'));
  });

  it('sets value using a functional state updater', () => {
    const { result } = renderHook(() => useLocalStorage<number>('test_key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('test_key')).toBe(JSON.stringify(15));
  });

  it('returns initialValue and logs warning if JSON parsing fails', () => {
    window.localStorage.setItem('test_key', 'invalid-json-string');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    expect(result.current[0]).toBe('default_val');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('logs warning if localStorage.setItem fails', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test_key', 'default_val'));
    
    act(() => {
      result.current[1]('new_val');
    });

    expect(warnSpy).toHaveBeenCalled();
  });
});
