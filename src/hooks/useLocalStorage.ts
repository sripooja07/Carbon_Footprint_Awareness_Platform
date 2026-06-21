import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Type-safe, production-ready LocalStorage hook
 * 
 * @param {string} key - Browser storage key reference
 * @param {T} initialValue - Fallback value if storage slot is empty
 * @returns {[T, Function]} State value and state updates dispatcher
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  
  // Safe read routine
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Keep a ref of the latest storedValue to avoid dependency change in setValue
  const storedValueRef = useRef<T>(storedValue);
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  // Safe write routine
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValueRef.current) : value;
      setStoredValue(newValue);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
