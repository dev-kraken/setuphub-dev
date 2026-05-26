import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/shared/json-ld';
import {
  BlogPostHeader,
  BlogRelatedPosts,
  generateBlogPostingSchema,
  getAllPublishedSlugs,
  getPostBySlug,
  getPostOgImage,
} from '@/features/blog';
import { siteConfig } from '@/lib/constants';
import { constructMetadata, generateBreadcrumbSchema } from '@/lib/metadata';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Pre-renders every published post at build time. Returning an empty array
 * here would force all post pages to be rendered on demand and skipped by
 * Google's first crawl — we want them in the bundle.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return constructMetadata(siteConfig, {
      title: 'Post not found',
      noIndex: true,
      noFollow: true,
    });
  }

  return constructMetadata(siteConfig, {
    title: post.meta.title,
    description: post.meta.description,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.meta.publishedAt,
    modifiedTime: post.meta.updatedAt ?? post.meta.publishedAt,
    authors: post.meta.author ? [post.meta.author] : undefined,
    section: post.meta.tags?.[0],
    tags: post.meta.tags,
    keywords: [...(post.meta.tags ?? []), ...siteConfig.keywords],
    image: {
      url: getPostOgImage(post.meta),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: post.meta.title,
    },
    openGraph: { type: 'article' },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const { Content, meta, readingTimeMinutes, wordCount, articleBody } = post;

  return (
    <article className="mx-auto w-full max-w-3xl py-4 md:px-6 md:py-8">
      <JsonLd
        data={[
          generateBlogPostingSchema(siteConfig, {
            slug: post.slug,
            meta,
            readingTimeMinutes,
            wordCount,
            articleBody,
          }),
          generateBreadcrumbSchema(siteConfig, [
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: meta.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <BlogPostHeader meta={meta} readingTimeMinutes={readingTimeMinutes} />

      <div className="font-inter">
        <Content />
      </div>

      <BlogRelatedPosts slug={post.slug} />
    </article>
  );
}
