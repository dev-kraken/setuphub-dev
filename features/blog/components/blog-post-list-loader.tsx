import { getAllPostSummaries } from '../lib/posts';
import { BlogPostGrid } from './blog-post-grid';

/**
 * Server component — pulls the published-post list at request/build time and
 * hands it to the pure grid. Loader/grid split matches
 * `features/explore` (`ExploreSetupsLoader` + `ExploreSetupsGrid`).
 *
 * Calls into `getAllPostSummaries` (memoized via React `cache()`), so when
 * the page also fetches the list for JSON-LD, both calls share one read.
 */
export async function BlogPostListLoader() {
  const posts = await getAllPostSummaries();
  return <BlogPostGrid posts={posts} />;
}
