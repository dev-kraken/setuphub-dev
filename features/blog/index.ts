/**
 * Blog Feature
 *
 * MDX-powered blog: post registry, UI components, JSON-LD generators.
 * MDX content lives in `./content/posts/*.mdx`.
 */

// Components
export { BlogPostCard } from './components/blog-post-card';
export { BlogPostGrid } from './components/blog-post-grid';
export { BlogPostHeader } from './components/blog-post-header';
export { BlogPostListLoader } from './components/blog-post-list-loader';
export { BlogRelatedPosts } from './components/blog-related-posts';
export { BlogTagList } from './components/blog-tag-list';

// Data & SEO
export { generateBlogPostingSchema, generateBlogSchema } from './lib/jsonld';
export { getPostOgImage } from './lib/og-image';
// `getAllPosts` is deliberately not re-exported — it returns React components
// that should never cross the feature boundary. Use `getAllPostSummaries`.
export { getAllPostSummaries, getAllPublishedSlugs, getPostBySlug, getRelatedPosts } from './lib/posts';
export type { Post, PostMeta, PostSummary } from './lib/types';
