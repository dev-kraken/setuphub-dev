import type { PostMeta } from './types';

/**
 * Resolves the social/preview image for a post.
 *
 * Authors can override per-post by setting `meta.image` (used as-is, absolute
 * or relative). When omitted, we point at the dynamic `/api/og/blog` route so
 * every post still gets a unique branded preview instead of the generic site
 * OG image showing in every Slack/X/LinkedIn unfurl.
 */
export function getPostOgImage(meta: PostMeta): string {
  if (meta.image) return meta.image;

  const params = new URLSearchParams({
    title: meta.title,
    description: meta.description,
  });

  if (meta.author?.name) {
    params.set('author', meta.author.name);
  }

  return `/api/og/blog?${params.toString()}`;
}
