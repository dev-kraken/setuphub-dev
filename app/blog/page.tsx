import { JsonLd } from '@/components/shared/json-ld';
import { Separator } from '@/components/ui/separator';
import { BlogPostGrid, generateBlogSchema, getAllPostSummaries } from '@/features/blog';
import { siteConfig } from '@/lib/constants';
import { constructMetadata, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/metadata';

const PAGE_URL = '/blog';
const PAGE_HEADING = 'SetupHub Blog — IDE setup guides and developer tooling';
const PAGE_TITLE = 'Blog';
const PAGE_DESCRIPTION =
  'Guides and articles on IDE setup, developer tooling, and shipping productive workflows — written for developers who care about their environment.';

export const metadata = constructMetadata(siteConfig, {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  keywords: [...siteConfig.keywords, 'blog', 'tutorials', 'guides', 'developer blog', 'ide tips', 'vscode tips'],
});

export default async function BlogIndexPage() {
  // Single fetch — `getAllPostSummaries` is wrapped in React `cache()` so the
  // grid + JSON-LD share one read of the post list per request.
  const posts = await getAllPostSummaries();

  return (
    <main className="mx-auto w-full py-4 md:max-w-5xl md:px-6 md:py-8 lg:px-8">
      <JsonLd
        data={[
          generateWebPageSchema(siteConfig, {
            title: `${PAGE_TITLE} — ${siteConfig.name}`,
            description: PAGE_DESCRIPTION,
            url: PAGE_URL,
          }),
          generateBlogSchema(siteConfig, posts),
          generateBreadcrumbSchema(siteConfig, [
            { name: 'Home', url: '/' },
            { name: 'Blog', url: PAGE_URL },
          ]),
        ]}
      />
      <section className="w-full px-0">
        <div className="mb-8">
          <h1 className="font-oxanium mb-2 text-3xl font-semibold tracking-tight text-balance text-white md:text-4xl">
            {PAGE_HEADING}
          </h1>
          <p className="font-inter max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {PAGE_DESCRIPTION}
          </p>
        </div>
        <Separator className="mb-8 border-neutral-800/50" />
        <BlogPostGrid posts={posts} />
      </section>
    </main>
  );
}
