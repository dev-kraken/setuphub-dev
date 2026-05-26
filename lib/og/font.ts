/**
 * Shared Google Font loader for Edge OG routes.
 *
 * Caches font binaries at module scope. Edge instances are ephemeral, but a
 * warm instance reuses the cache across requests and across OG routes
 * (setup + blog) — a real saving when both routes hit the same instance.
 */

const ONE_DAY_SECONDS = 60 * 60 * 24;

// Cap how many subset binaries we keep per warm instance. Each entry can be
// ~20–50 KB and a busy warm instance can otherwise grow unbounded as titles
// vary. LRU eviction is good enough; Google's CDN absorbs the re-fetch.
const FONT_CACHE_MAX_ENTRIES = 32;

// Key: `${font}-${weight}-${characterSubset}`. The subset is part of the key
// because Google Fonts returns a different file per requested glyph set —
// caching by font name alone would serve the wrong subset to later callers.
const fontCache = new Map<string, ArrayBuffer>();

function cacheGet(key: string): ArrayBuffer | undefined {
  const value = fontCache.get(key);
  if (!value) return undefined;
  // Touch entry — Map iteration order is insertion order, so re-inserting
  // moves the key to the end and turns this into a usable LRU.
  fontCache.delete(key);
  fontCache.set(key, value);
  return value;
}

function cacheSet(key: string, value: ArrayBuffer): void {
  if (fontCache.size >= FONT_CACHE_MAX_ENTRIES) {
    const oldest = fontCache.keys().next().value;
    if (oldest !== undefined) fontCache.delete(oldest);
  }
  fontCache.set(key, value);
}

interface LoadGoogleFontOptions {
  font: string;
  /** Visible characters that need glyphs. Used as `text=` to subset the file. */
  text: string;
  weight?: number;
}

export async function loadGoogleFont({ font, text, weight = 600 }: LoadGoogleFontOptions): Promise<ArrayBuffer> {
  // Dedup characters before hitting Google — a 200-char title with lots of
  // repeats becomes a much smaller subset request. `Array.from` walks code
  // points, so surrogate pairs stay intact.
  const subset = Array.from(new Set(Array.from(text))).join('');
  const cacheKey = `${font}-${weight}-${subset}`;

  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font,
  )}:wght@${weight}&text=${encodeURIComponent(subset)}`;

  const css = await fetch(cssUrl, { next: { revalidate: ONE_DAY_SECONDS } }).then((res) => res.text());
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (!match?.[1]) {
    throw new Error(`Failed to load font: ${font}`);
  }

  const fontData = await fetch(match[1]).then((res) => {
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return res.arrayBuffer();
  });

  cacheSet(cacheKey, fontData);
  return fontData;
}
