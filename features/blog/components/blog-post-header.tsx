import { IconClock } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { formatPostDate } from '../lib/format';
import type { PostMeta } from '../lib/types';
import { BlogTagList } from './blog-tag-list';

interface BlogPostHeaderProps {
  meta: PostMeta;
  readingTimeMinutes: number;
}

/**
 * Visible byline + headline block at the top of an article. The wrapping
 * `<header>` carries the H1, which is what Google and AI engines treat as the
 * canonical headline for the page (the meta `<title>` is secondary).
 */
export function BlogPostHeader({ meta, readingTimeMinutes }: BlogPostHeaderProps) {
  const author = meta.author;

  return (
    <header className="mb-10 border-b border-neutral-800 pb-8">
      <nav aria-label="Breadcrumb" className="font-inter mb-6 text-sm text-neutral-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-neutral-300">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-neutral-300">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="line-clamp-1 text-neutral-300">
            {meta.title}
          </li>
        </ol>
      </nav>

      <h1 className="font-oxanium mb-4 text-3xl font-semibold tracking-tight text-balance text-white md:text-5xl">
        {meta.title}
      </h1>

      <p className="font-inter mb-6 text-lg text-neutral-400 md:text-xl">{meta.description}</p>

      <div className="font-inter flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
        {author && (
          <>
            <span className="text-neutral-300">
              {author.url ? (
                <a
                  href={author.url}
                  target="_blank"
                  rel="noopener noreferrer author"
                  className="hover:text-primary"
                >
                  {author.name}
                </a>
              ) : (
                author.name
              )}
            </span>
            <span aria-hidden>•</span>
          </>
        )}
        <time dateTime={meta.publishedAt}>{formatPostDate(meta.publishedAt)}</time>
        {meta.updatedAt && meta.updatedAt !== meta.publishedAt && (
          <>
            <span aria-hidden>•</span>
            <span>
              Updated <time dateTime={meta.updatedAt}>{formatPostDate(meta.updatedAt)}</time>
            </span>
          </>
        )}
        <span aria-hidden>•</span>
        <span className="inline-flex items-center gap-1">
          <IconClock className="size-3.5" strokeWidth={1.5} aria-hidden />
          {readingTimeMinutes} min read
        </span>
      </div>

      {meta.tags && meta.tags.length > 0 && (
        <div className="mt-6">
          <BlogTagList tags={meta.tags} />
        </div>
      )}

      {meta.heroImage && (
        <div className="mt-8 overflow-hidden rounded-lg border border-neutral-800">
          <Image
            src={meta.heroImage.src}
            alt={meta.heroImage.alt}
            width={meta.heroImage.width ?? 1600}
            height={meta.heroImage.height ?? 900}
            sizes="(min-width: 1024px) 768px, 100vw"
            priority
            className="h-auto w-full"
          />
        </div>
      )}
    </header>
  );
}
