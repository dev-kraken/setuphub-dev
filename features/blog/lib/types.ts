import type { ComponentType } from 'react';

/**
 * Shape every blog MDX file exports as `meta`. Authors fill these fields in
 * the MDX `export const meta = {...}` block — they end up in the page
 * `<head>`, JSON-LD, and OG/Twitter cards.
 */
export interface PostMeta {
  /** Headline. Doubles as the `<title>` and the OG/Twitter title. */
  title: string;
  /** ~150-char summary used as the meta description, OG description, and card subtitle. */
  description: string;
  /** ISO 8601 date — when the post was first published. */
  publishedAt: string;
  /** ISO 8601 date — last meaningful edit. Optional; falls back to `publishedAt`. */
  updatedAt?: string;
  /** Author shown on the byline. Falls back to the site author when omitted. */
  author?: {
    name: string;
    url?: string;
  };
  /** Lowercase, kebab-case topic tags. First tag is treated as the primary category. */
  tags?: string[];
  /**
   * Path to the social/preview image. Absolute URLs are passed through;
   * relative paths are resolved against `siteConfig.url`.
   * When omitted, a dynamic OG image is generated via `/api/og/blog`.
   */
  image?: string;
  /**
   * Optional lead/hero image rendered above the article body. Set this when a
   * post needs an above-the-fold visual — it's marked `priority` so it can
   * legitimately be the LCP element.
   */
  heroImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Hide from index, sitemap, and RSS without deleting the file. */
  draft?: boolean;
}

export interface Post {
  /** URL slug — derived from the filename, no extension. */
  slug: string;
  meta: PostMeta;
  Content: ComponentType;
  /** Estimated reading time in whole minutes. */
  readingTimeMinutes: number;
  /** Word count of the rendered prose — surfaces in `BlogPosting.wordCount`. */
  wordCount: number;
  /**
   * Plain-text prose extracted from the MDX source. Capped server-side and
   * embedded in `BlogPosting.articleBody` so AI-search engines and rich-result
   * crawlers can ingest the page without executing JS.
   */
  articleBody: string;
}

/** Index-page projection — drops the rendered component to keep payloads small. */
export type PostSummary = Omit<Post, 'Content'>;
