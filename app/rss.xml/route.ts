import { getAllPostSummaries, type PostSummary } from '@/features/blog';
import { siteConfig } from '@/lib/constants';
import { absoluteUrl, normalizeBaseUrl } from '@/lib/metadata';

const FEED_TITLE = `${siteConfig.name} — Blog`;
const FEED_DESCRIPTION =
  'Guides and articles on IDE setup, developer tooling, and shipping productive workflows.';

/**
 * Escape characters that are unsafe inside XML element text and attribute
 * values. CDATA isn't enough on its own — `]]>` inside content would close
 * the section unexpectedly, so we escape instead of wrapping.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function entry(post: PostSummary, baseUrl: string): string {
  const url = `${baseUrl}/blog/${post.slug}`;
  const updated = new Date(post.meta.updatedAt ?? post.meta.publishedAt).toISOString();
  const published = new Date(post.meta.publishedAt).toISOString();
  const authorName = post.meta.author?.name ?? siteConfig.author?.name ?? siteConfig.name;
  const tagsXml = (post.meta.tags ?? [])
    .map((tag) => `    <category term="${escapeXml(tag)}" />`)
    .join('\n');

  return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(post.meta.title)}</title>
    <link href="${url}" />
    <updated>${updated}</updated>
    <published>${published}</published>
    <author><name>${escapeXml(authorName)}</name></author>
    <summary type="text">${escapeXml(post.meta.description)}</summary>
${tagsXml}
  </entry>`;
}

export async function GET() {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const feedUrl = `${baseUrl}/rss.xml`;
  const posts = await getAllPostSummaries().catch(() => [] as PostSummary[]);
  const updated = posts[0]?.meta.updatedAt ?? posts[0]?.meta.publishedAt ?? new Date().toISOString();

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_DESCRIPTION)}</subtitle>
  <id>${baseUrl}/blog</id>
  <link rel="alternate" type="text/html" href="${baseUrl}/blog" />
  <link rel="self" type="application/atom+xml" href="${feedUrl}" />
  <updated>${new Date(updated).toISOString()}</updated>
  <author><name>${escapeXml(siteConfig.author?.name ?? siteConfig.name)}</name></author>
  <icon>${absoluteUrl('/favicon.ico', baseUrl)}</icon>
${posts.map((post) => entry(post, baseUrl)).join('\n')}
</feed>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
