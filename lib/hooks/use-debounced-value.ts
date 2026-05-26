'use client';

import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 300;

/**
 * Returns a debounced version of the provided value.
 * The returned value only updates after `delay` ms of stability.
 */
export function useDebouncedValue<T>(value: T, delay: number = DEFAULT_DELAY_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
