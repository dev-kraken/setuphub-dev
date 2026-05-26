'use server';

import { serverEnv } from '@/lib/env';

import type { GoogleFont } from '../lib/fonts';

const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

/** 24 hours in seconds — fetch-level revalidation window. */
const CACHE_DURATION_SECONDS = 24 * 60 * 60;

/**
 * Server action that returns the Google Fonts catalog sorted by popularity.
 * Response is cached for {@link CACHE_DURATION_SECONDS} via the Data Cache.
 *
 * @throws Error if the API key is missing or the upstream request fails.
 */
export async function getGoogleFonts(): Promise<GoogleFont[]> {
  const apiKey = serverEnv.GOOGLE_FONTS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Fonts API key is not configured');
  }

  const response = await fetch(`${API_URL}?key=${apiKey}&sort=popularity`, {
    next: { revalidate: CACHE_DURATION_SECONDS, tags: ['google-fonts'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Fonts: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { items: GoogleFont[] };
  return data.items;
}
