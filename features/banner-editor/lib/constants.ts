import { FONT_FAMILY } from '../types';

export { getIcon, ICON_LIST, ICON_MAP, type IconName, isValidIconName } from './icons';

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

export const PRESET_FONTS = [
  FONT_FAMILY.SANS,
  FONT_FAMILY.MONO,
  FONT_FAMILY.SERIF,
  FONT_FAMILY.IMPACT,
  FONT_FAMILY.SYSTEM,
] as const;

export type PresetFont = (typeof PRESET_FONTS)[number];

export function isPresetFont(font: string): font is PresetFont {
  return (PRESET_FONTS as readonly string[]).includes(font);
}

export const FONT_DEFINITIONS: Record<string, string> = {
  [FONT_FAMILY.SANS]: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  [FONT_FAMILY.MONO]: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace',
  [FONT_FAMILY.SERIF]: 'Georgia, Cambria, "Times New Roman", Times, serif',
  [FONT_FAMILY.IMPACT]: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  [FONT_FAMILY.SYSTEM]: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

/**
 * Returns the CSS `font-family` value for a given font name.
 * Preset fonts resolve via {@link FONT_DEFINITIONS}; Google Fonts fall back to a quoted family.
 */
export function getFontFamily(fontName: string): string {
  return FONT_DEFINITIONS[fontName] || `"${fontName}", sans-serif`;
}

export const FONT_SIZE_MIN = 32;
export const FONT_SIZE_MAX = 70;
export const ICON_SIZE = 48;

export const DEFAULT_PIXEL_RATIO = 3;

export const TITLE_MAX_LENGTH = 50;
export const FOOTER_MAX_LENGTH = 30;

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
