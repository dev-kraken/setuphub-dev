import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateTextForDescriptionSEO(text: string, maxLength = 150) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

/**
 * Returns the first user-perceived character of a string, safe for strings
 * starting with emoji or other characters made of surrogate pairs.
 * Returns `fallback` when the trimmed string is empty.
 *
 * `str[0]` returns a UTF-16 code unit, which for emoji is half a surrogate
 * pair and renders as `�`. Lone surrogates can serialize differently between
 * SSR and the client, causing hydration mismatches.
 */
export function getInitial(...candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    const first = Array.from(trimmed)[0];
    if (first) return first;
  }
  return '?';
}
