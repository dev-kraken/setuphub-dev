'use server';

import { unstable_cache } from 'next/cache';

import { serverEnv } from '@/lib/env';

import type { GoogleFont } from '../lib/fonts';

const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

/**
 * Cache duration for Google Fonts API response.
 * 24 hours in seconds for unstable_cache.
 */
const CACHE_DURATION_SECONDS = 24 * 60 * 60;

/**
 * Fetches fonts from Google Fonts API.
 * This is the raw fetch function without caching.
 */
async function fetchFontsFromAPI(): Promise<GoogleFont[]> {
  const apiKey = serverEnv.GOOGLE_FONTS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Fonts API key is not configured');
  }

  const response = await fetch(`${API_URL}?key=${apiKey}&sort=popularity`, {
    next: { revalidate: CACHE_DURATION_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Fonts: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items as GoogleFont[];
}

/**
 * Cached version of the Google Fonts fetch.
 * Uses Next.js unstable_cache for server-side caching across all requests.
 */
const getCachedGoogleFonts = unstable_cache(
  fetchFontsFromAPI,
  ['google-fonts'],
  {
    revalidate: CACHE_DURATION_SECONDS,
    tags: ['google-fonts'],
  }
);

/**
 * Server action to get Google Fonts.
 * Returns cached fonts list sorted by popularity.
 *
 * @returns Promise resolving to array of GoogleFont objects
 * @throws Error if API key is not configured or fetch fails
 */
export async function getGoogleFonts(): Promise<GoogleFont[]> {
  return getCachedGoogleFonts();
}
