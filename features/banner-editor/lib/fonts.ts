export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

// Cache for loaded font stylesheets
const loadedFonts = new Set<string>();

// Cache for the Google Fonts API response
let fontsCache: GoogleFont[] | null = null;
let fontsCacheTimestamp: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  // Check if we have a valid cache
  if (fontsCache && fontsCacheTimestamp && Date.now() - fontsCacheTimestamp < CACHE_DURATION) {
    return fontsCache;
  }

  if (!API_KEY) {
    throw new Error('Google Fonts API key is not configured');
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&sort=popularity`);
    if (!response.ok) {
      throw new Error('Failed to fetch Google Fonts');
    }
    const data = await response.json();
    fontsCache = data.items;
    fontsCacheTimestamp = Date.now();
    return data.items;
  } catch (error) {
    // If fetch fails and we have a cache, return it even if expired
    if (fontsCache) {
      return fontsCache;
    }
    console.error('Error fetching Google Fonts:', error);
    throw error;
  }
}

/**
 * Generates the Google Fonts CSS URL for a font family.
 * @param fontFamily - The font family name
 * @returns The Google Fonts CSS URL
 */
export function getFontUrl(fontFamily: string): string {
  const encodedFamily = encodeURIComponent(fontFamily);
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}&display=swap`;
}

/**
 * Result of a font loading operation.
 */
export interface FontLoadResult {
  /** Whether the font was loaded successfully */
  success: boolean;
  /** The font family name */
  family: string;
  /** Error message if loading failed */
  error?: string;
  /** Whether the font was already cached */
  cached?: boolean;
}

/**
 * Loads a Google Font by injecting a stylesheet link.
 * Returns a structured result instead of throwing.
 * @param fontFamily - The font family name to load
 * @returns Promise resolving to FontLoadResult
 */
export async function loadFont(fontFamily: string): Promise<FontLoadResult> {
  // Guard against undefined or empty font names
  if (!fontFamily || typeof fontFamily !== 'string') {
    return {
      success: false,
      family: fontFamily ?? '',
      error: 'Invalid font name: font family must be a non-empty string',
    };
  }

  const trimmedFamily = fontFamily.trim();
  if (!trimmedFamily) {
    return {
      success: false,
      family: fontFamily,
      error: 'Invalid font name: font family cannot be empty',
    };
  }

  // Return early if already loaded
  if (loadedFonts.has(trimmedFamily)) {
    return {
      success: true,
      family: trimmedFamily,
      cached: true,
    };
  }

  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.href = getFontUrl(trimmedFamily);
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous'; // Enable CORS for font stylesheets

    link.onload = () => {
      loadedFonts.add(trimmedFamily);
      resolve({
        success: true,
        family: trimmedFamily,
        cached: false,
      });
    };

    link.onerror = () => {
      // Don't reject, return error result - font might still work with fallback
      console.warn(`Could not load font: ${trimmedFamily}`);
      resolve({
        success: false,
        family: trimmedFamily,
        error: `Failed to load font stylesheet for "${trimmedFamily}"`,
      });
    };

    document.head.appendChild(link);
  });
}

/**
 * Checks if a font has already been loaded.
 * @param fontFamily - The font family name to check
 * @returns True if the font is already loaded
 */
export function isFontLoaded(fontFamily: string): boolean {
  return loadedFonts.has(fontFamily.trim());
}

export interface FontPickerProps {
  onFontSelect?: (font: GoogleFont) => void;
  value?: string;
}

export const FONT_CATEGORIES = ['serif', 'sans-serif', 'display', 'handwriting', 'monospace'] as const;

export type FontCategory = (typeof FONT_CATEGORIES)[number];

export const FONT_WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

export type FontWeight = (typeof FONT_WEIGHTS)[number];
