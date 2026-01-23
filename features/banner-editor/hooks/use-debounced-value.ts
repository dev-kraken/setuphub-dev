'use client';

import { useEffect, useState } from 'react';

import { DEBOUNCE_DELAY_MS } from '../lib/constants';

/**
 * Returns a debounced version of the provided value.
 * The returned value only updates after the specified delay
 * has passed without the input value changing.
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: DEBOUNCE_DELAY_MS)
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = DEBOUNCE_DELAY_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
