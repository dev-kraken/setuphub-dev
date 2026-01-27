import { IconChevronDown } from '@tabler/icons-react';

import { FONT_FAMILY } from '../types';

// Re-export icon utilities from the icons module
export { getIcon, ICON_LIST, ICON_MAP, type IconName,isValidIconName } from './icons';

export const PRESET_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#14b8a6',
  '#ffffff',
  '#000000',
] as const;

// Preset font names
export const PRESET_FONTS = [
  FONT_FAMILY.SANS,
  FONT_FAMILY.MONO,
  FONT_FAMILY.SERIF,
  FONT_FAMILY.IMPACT,
  FONT_FAMILY.SYSTEM,
] as const;

export type PresetFont = (typeof PRESET_FONTS)[number];

/**
 * Type guard to check if a string is a preset font.
 */
export function isPresetFont(font: string): font is PresetFont {
  return (PRESET_FONTS as readonly string[]).includes(font);
}

// Font definitions mapping font names to CSS font-family values
export const FONT_DEFINITIONS: Record<string, string> = {
  [FONT_FAMILY.SANS]: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  [FONT_FAMILY.MONO]: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace',
  [FONT_FAMILY.SERIF]: 'Georgia, Cambria, "Times New Roman", Times, serif',
  [FONT_FAMILY.IMPACT]: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  [FONT_FAMILY.SYSTEM]: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

/**
 * Get the CSS font-family value for a given font name.
 * For preset fonts, returns the mapped value; for Google Fonts, returns the font name directly.
 */
export function getFontFamily(fontName: string): string {
  return FONT_DEFINITIONS[fontName] || `"${fontName}", sans-serif`;
}

// Typography constants
export const FONT_SIZE_MIN = 32;
export const FONT_SIZE_MAX = 70;
export const ICON_SIZE = 48;

// Export constants
export const DEFAULT_PIXEL_RATIO = 3;

// Input length limits
export const TITLE_MAX_LENGTH = 50;
export const FOOTER_MAX_LENGTH = 30;

// Timing constants
export const DEBOUNCE_DELAY_MS = 300;

// Visual constants
export const BORDER_OPACITY = 0.3;
export const RADIAL_GLOW_OPACITY = 0.65;
export const BACKGROUND_TEXTURE_OPACITY = 0.03;

export const DEFAULT_CONFIG = {
  theme: 'dark' as const,
  accentColor: '#f43f5e',
  selectedIcon: 'Heart',
  selectedFont: FONT_FAMILY.SANS,
  titleFontSize: 60,
  title: 'SetupHub.dev',
  footerLeft: '>_ setuphub.dev',
  footerRight: '#dev-kraken',
};

// Re-export ChevronDown for use in components
export { IconChevronDown };
