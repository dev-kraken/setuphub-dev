import { IconClock } from '@tabler/icons-react';
import type { Route } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { formatPostDate } from '../lib/format';
import type { PostSummary } from '../lib/types';
import { BlogTagList } from './blog-tag-list';

interface BlogPostCardProps {
  post: PostSummary;
}

/**
 * Card link for a single post on the index page. The whole card is one anchor
 * — better for both keyboard users (one tab stop) and crawlers (one link
 * carrying the headline as anchor text).
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
  const href = `/blog/${post.slug}` as Route<string>;

  return (
    <article className="group">
      <Link href={href} aria-label={`Read: ${post.meta.title}`} className="block h-full">
        <Card className="h-full border-neutral-800/80 bg-neutral-950/40 transition-colors group-hover:border-neutral-700">
          <CardHeader>
            <div className="text-muted-foreground font-inter flex items-center gap-3 text-xs">
              <time dateTime={post.meta.publishedAt}>{formatPostDate(post.meta.publishedAt)}</time>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1">
                <IconClock className="size-3.5" strokeWidth={1.5} aria-hidden />
                {post.readingTimeMinutes} min read
              </span>
            </div>
            <CardTitle className="font-oxanium text-xl text-white transition-colors group-hover:text-primary md:text-2xl">
              {post.meta.title}
            </CardTitle>
            <CardDescription className="font-inter line-clamp-3 text-base text-neutral-400">
              {post.meta.description}
            </CardDescription>
          </CardHeader>
          {post.meta.tags && post.meta.tags.length > 0 && (
            <CardContent>
              <BlogTagList tags={post.meta.tags} />
            </CardContent>
          )}
        </Card>
      </Link>
    </article>
  );
}
