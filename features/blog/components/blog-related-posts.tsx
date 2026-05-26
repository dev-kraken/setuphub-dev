import { getRelatedPosts } from '../lib/posts';
import { BlogPostCard } from './blog-post-card';

interface BlogRelatedPostsProps {
  slug: string;
}

export async function BlogRelatedPosts({ slug }: BlogRelatedPostsProps) {
  const related = await getRelatedPosts(slug);
  if (related.length === 0) return null;

  return (
    <aside className="mt-16 border-t border-neutral-800 pt-10">
      <h2 className="font-oxanium mb-6 text-2xl font-semibold tracking-tight text-white">Keep reading</h2>
      <ul className="grid gap-6 md:grid-cols-2">
        {related.map((post) => (
          <li key={post.slug}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
