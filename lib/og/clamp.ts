/**
 * Clamps a string to `max` user-perceived characters (code points), not
 * UTF-16 code units. Slicing by `string.slice` would cut a surrogate pair in
 * half — an emoji at the boundary becomes `\uD83D` and renders as a tofu.
 *
 * Returns an empty string for missing input so callers don't need to null-check.
 */
export function clampToCodePoints(value: string | null | undefined, max: number): string {
  if (!value) return '';
  const codePoints = Array.from(value);
  if (codePoints.length <= max) return value;
  return `${codePoints.slice(0, max - 1).join('')}…`;
}
