import { useMemo } from 'react';

/**
 * Hook to humanize a setting key name.
 * Converts "editor.tabSize" to "Tab Size".
 */
export function useHumanize(key: string): string {
  return useMemo(() => {
    if (!key) return '';

    // Remove the first part
    const parts = key.split('.');
    const remainingParts = parts.slice(1); // remove "editor"

    // Join remaining parts and convert camelCase to words
    const result = remainingParts
      .map(
        (part) =>
          part
            .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
            .replace(/^./, (str) => str.toUpperCase()), // capitalize first letter
      )
      .join(' '); // join with space

    return result.trim();
  }, [key]);
}
