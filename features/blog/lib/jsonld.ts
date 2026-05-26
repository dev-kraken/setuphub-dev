import type { Blog, BlogPosting, ImageObject, WithContext } from 'schema-dts';

import { absoluteUrl, normalizeBaseUrl, type SiteConfig } from '@/lib/metadata';

import { getPostOgImage } from './og-image';
import type { PostSummary } from './types';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Cap on posts emitted in the `Blog.blogPost[]` graph. Keeps the index-page
 * JSON-LD reasonably sized — crawlers paginate via the sitemap anyway.
 */
const BLOG_FEED_MAX_ITEMS = 20;

function imageObject(url: string, width = OG_WIDTH, height = OG_HEIGHT): ImageObject {
  return {
    '@type': 'ImageObject',
    url,
    width: String(width),
    height: String(height),
  };
}

export function generateBlogPostingSchema(siteConfig: SiteConfig, post: PostSummary): WithContext<BlogPosting> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  // Same source of truth as the OG/Twitter image — avoids the JSON-LD claiming
  // one image while Slack/X unfurl renders another.
  const imageUrl = absoluteUrl(getPostOgImage(post.meta), baseUrl);
  const authorName = post.meta.author?.name ?? siteConfig.author?.name ?? siteConfig.name;
  const authorUrl = post.meta.author?.url ?? siteConfig.author?.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description: post.meta.description,
    url: postUrl,
    image: imageObject(imageUrl),
    datePublished: post.meta.publishedAt,
    dateModified: post.meta.updatedAt ?? post.meta.publishedAt,
    inLanguage: siteConfig.locale ?? 'en',
    // Required by Google's Article rich-result spec. Without `mainEntityOfPage`
    // the page can validate but loses eligibility for the rich card.
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
      // TODO(seo): Ship a raster ≤600×60 brand logo and point this at it for
      // strict Article rich-result eligibility. Width/height are declared
      // explicitly so the structured-data parser doesn't need to fetch.
      logo: imageObject(`${baseUrl}/images/logos/brand-light.svg`, 600, 60),
    },
    ...(post.meta.tags && post.meta.tags.length > 0 && {
      keywords: post.meta.tags.join(', '),
      articleSection: post.meta.tags[0],
    }),
    ...(post.wordCount > 0 && { wordCount: post.wordCount }),
    ...(post.articleBody && { articleBody: post.articleBody }),
    ...(post.readingTimeMinutes > 0 && {
      // `timeRequired` uses ISO 8601 duration. Surfaces "5 min read" to AI engines
      // that consume structured data (Perplexity, AI Overviews).
      timeRequired: `PT${post.readingTimeMinutes}M`,
    }),
  };
}

export function generateBlogSchema(siteConfig: SiteConfig, posts: PostSummary[]): WithContext<Blog> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} — Blog`,
    url: `${baseUrl}/blog`,
    description:
      'Guides, tutorials, and articles on IDE setup, developer tooling, and shipping productive workflows.',
    inLanguage: siteConfig.locale ?? 'en',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    blogPost: posts.slice(0, BLOG_FEED_MAX_ITEMS).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.meta.title,
      description: post.meta.description,
      url: `${baseUrl}/blog/${post.slug}`,
      image: imageObject(absoluteUrl(getPostOgImage(post.meta), baseUrl)),
      datePublished: post.meta.publishedAt,
      dateModified: post.meta.updatedAt ?? post.meta.publishedAt,
    })),
  };
}
