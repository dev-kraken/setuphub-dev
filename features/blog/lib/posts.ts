import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cache } from 'react';

import { countWords, extractProse } from './extract-prose';
import { estimateReadingTime } from './reading-time';
import type { Post, PostMeta, PostSummary } from './types';

// Resolved against the deploy root via `process.cwd()`. In Vercel/Lambda the
// JS is bundled into `.next/server/chunks/...`, so an `import.meta.url`-based
// path would point to the chunk location — not where the .mdx files actually
// ship to. `process.cwd()` is `/var/task` on Lambda, which matches the layout
// produced by `outputFileTracingIncludes` in `next.config.ts`.
const POSTS_DIR = join(process.cwd(), 'features', 'blog', 'content', 'posts');
const MDX_EXT = '.mdx';

/** Cap the JSON-LD `articleBody` so the page payload stays sensible. */
const ARTICLE_BODY_MAX_CHARS = 5000;

/**
 * Filenames double as URL slugs. Locked to lowercase letters, digits, and
 * hyphens so the routing surface stays predictable and SEO-friendly.
 */
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const listSlugs = cache((): string[] => {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(MDX_EXT))
    .map((file) => file.slice(0, -MDX_EXT.length))
    .filter((slug) => {
      if (SLUG_PATTERN.test(slug)) return true;
      // Surfacing this at build time is intentional — silently dropping a
      // misnamed file means an author wonders why their post is missing.
      console.warn(`[blog] Ignoring "${slug}${MDX_EXT}": slug must match ${SLUG_PATTERN}.`);
      return false;
    });
});

/**
 * `@next/mdx` compiles the imported module so we can pull `meta` and the
 * default export (the rendered content) from it directly. The dynamic-import
 * context is anchored by the static prefix in the template literal, which
 * limits bundling to this directory.
 */
const loadPost = cache(async (slug: string): Promise<Post> => {
  const mod = (await import(`../content/posts/${slug}.mdx`)) as {
    default: Post['Content'];
    meta?: PostMeta;
  };

  if (!mod.meta) {
    throw new Error(`[blog] "${slug}${MDX_EXT}" is missing an \`export const meta\`.`);
  }

  // Read raw source once per slug per request — the cached fs read drives both
  // word count and the JSON-LD articleBody.
  const source = readFileSync(join(POSTS_DIR, `${slug}${MDX_EXT}`), 'utf8');
  const prose = extractProse(source);
  const wordCount = countWords(prose);

  return {
    slug,
    meta: mod.meta,
    Content: mod.default,
    readingTimeMinutes: estimateReadingTime(wordCount),
    wordCount,
    articleBody: prose.length > ARTICLE_BODY_MAX_CHARS ? `${prose.slice(0, ARTICLE_BODY_MAX_CHARS - 1)}…` : prose,
  };
});

function byNewest<T extends { meta: { publishedAt: string } }>(a: T, b: T): number {
  return new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime();
}

function isPublished(post: { meta: PostMeta }): boolean {
  return !post.meta.draft;
}

/** All published posts, newest first. Drafts are excluded. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const slugs = listSlugs();
  const posts = await Promise.all(slugs.map(loadPost));
  return posts.filter(isPublished).sort(byNewest);
});

/** Index-page projection — drops the rendered component to keep payloads small. */
export const getAllPostSummaries = cache(async (): Promise<PostSummary[]> => {
  const posts = await getAllPosts();
  return posts.map(({ Content: _Content, ...summary }) => summary);
});

/**
 * Resolves a single post. Returns `null` for unknown or draft slugs so the
 * caller can route to `notFound()` — preferable to throwing here, since the
 * 404 path is reached by any typo'd URL crawler.
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  if (!SLUG_PATTERN.test(slug)) return null;
  if (!listSlugs().includes(slug)) return null;

  const post = await loadPost(slug);
  return isPublished(post) ? post : null;
});

/** Powers `generateStaticParams` — only published slugs get pre-rendered. */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}

export const getRelatedPosts = cache(async (slug: string, limit = 3): Promise<PostSummary[]> => {
  const all = await getAllPostSummaries();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.meta.tags ?? []);
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      // Tag overlap is a decent proxy for relatedness without needing embeddings.
      score: (p.meta.tags ?? []).filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || byNewest(a.post, b.post));

  return scored.slice(0, limit).map((s) => s.post);
});
