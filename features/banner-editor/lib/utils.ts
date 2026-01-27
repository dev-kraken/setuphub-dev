/** Regex to validate 3-digit or 6-digit hex colors */
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Validates if a string is a valid hex color (3 or 6 digits).
 * @param color - The color string to validate
 * @returns True if the color is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

/**
 * Normalizes a hex color to 6-digit format.
 * Returns fallback color if input is invalid.
 * @param color - The hex color to normalize
 * @param fallback - Fallback color if invalid (default: '#000000')
 * @returns Normalized 6-digit hex color
 */
export function normalizeHexColor(color: string, fallback: string = '#000000'): string {
  if (!isValidHexColor(color)) return fallback;
  // Expand 3-digit hex to 6-digit
  if (color.length === 4) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
}

/**
 * Shades a hex color by a percentage.
 * Positive percent lightens, negative darkens.
 * @param color - The hex color to shade
 * @param percent - Percentage to lighten (positive) or darken (negative)
 * @returns The shaded hex color
 */
export function shadeColor(color: string, percent: number): string {
  const normalized = normalizeHexColor(color, color);
  // If normalization returned the original (invalid) color, return it as-is
  if (!isValidHexColor(normalized)) return color;

  const num = parseInt(normalized.replace('#', ''), 16);
  const r = Math.min(
    255,
    Math.max(0, Math.round(((num >> 16) * (100 + percent)) / 100))
  );
  const g = Math.min(
    255,
    Math.max(0, Math.round((((num >> 8) & 0x00ff) * (100 + percent)) / 100))
  );
  const b = Math.min(
    255,
    Math.max(0, Math.round(((num & 0x0000ff) * (100 + percent)) / 100))
  );

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/**
 * Converts a hex color to rgba with specified alpha.
 * Handles both 3-digit and 6-digit hex colors.
 * @param hex - The hex color to convert
 * @param alpha - The alpha value (0-1)
 * @returns The rgba color string, or original hex if invalid
 */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = normalizeHexColor(hex, hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!result) return hex;

  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

/**
 * Sanitizes user input by limiting length (no trim to avoid cursor jump).
 * Use `trimInput` on blur for final trimming.
 * @param input - The input string to sanitize
 * @param maxLength - Maximum length of the output (default: 100)
 * @returns Sanitized string (length-limited only)
 */
export function sanitizeInput(input: string, maxLength: number = 100): string {
  return input.slice(0, maxLength);
}

/**
 * Trims whitespace from input string.
 * Use this on blur to avoid cursor jumping during typing.
 * @param input - The input string to trim
 * @returns Trimmed string
 */
export function trimInput(input: string): string {
  return input.trim();
}

/**
 * Sanitizes a string for use as a filename.
 * Removes special characters, replaces spaces with dashes, and limits length.
 * @param input - The string to sanitize
 * @param maxLength - Maximum length of the filename (default: 50)
 * @param fallback - Fallback name if result is empty (default: 'banner')
 * @returns Sanitized filename-safe string
 */
export function sanitizeFilename(
  input: string,
  maxLength: number = 50,
  fallback: string = 'banner'
): string {
  const sanitized = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .slice(0, maxLength);
  
  return sanitized || fallback;
}

/**
 * Parsed footer result with highlighted first word and remaining text.
 */
export interface ParsedFooter {
  /** The first word to be highlighted */
  highlight: string;
  /** The remaining text after the first word */
  rest: string;
}

/**
 * Parses footer text to extract the first word (for highlighting) and the rest.
 * Handles edge cases like empty strings and single-word inputs.
 * @param text - The footer text to parse
 * @returns Parsed footer with highlight and rest properties
 */
export function parseFooterText(text: string): ParsedFooter {
  const trimmed = text.trim();
  if (!trimmed) {
    return { highlight: '', rest: '' };
  }
  
  const firstSpaceIndex = trimmed.indexOf(' ');
  if (firstSpaceIndex === -1) {
    // Single word - entire text is the highlight
    return { highlight: trimmed, rest: '' };
  }
  
  return {
    highlight: trimmed.slice(0, firstSpaceIndex),
    rest: trimmed.slice(firstSpaceIndex + 1),
  };
}
