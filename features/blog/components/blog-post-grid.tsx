import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

import type { PostSummary } from '../lib/types';
import { BlogPostCard } from './blog-post-card';

interface BlogPostGridProps {
  posts: PostSummary[];
}

/**
 * Pure presentational grid — receives already-loaded posts. Mirrors the
 * loader/grid split used by `features/explore` so the data-fetching surface
 * stays separate from layout concerns.
 */
export function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (posts.length === 0) {
    return (
      <Empty className="border-neutral-800/80">
        <EmptyHeader>
          <EmptyTitle className="font-oxanium">No posts yet</EmptyTitle>
          <EmptyDescription className="font-inter">
            Articles will appear here as they are published. Check back soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogPostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
