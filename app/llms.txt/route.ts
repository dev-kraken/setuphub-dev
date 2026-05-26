import { siteConfig } from '@/lib/constants';

/**
 * llms.txt — a markdown manifest that helps AI search engines (ChatGPT,
 * Perplexity, Google AI Overviews, etc.) discover and cite the most relevant
 * pages on this site.
 *
 * @see https://llmstxt.org
 */
export function GET() {
  const base = siteConfig.url.replace(/\/$/, '');

  const body = `# SetupHub

> ${siteConfig.description}

SetupHub lets developers sync, share, and discover IDE setups (VS Code, Cursor, Windsurf and other editors), including themes, fonts, settings, and extension lists. Each public profile and setup has a stable URL suitable for citation.

## Primary entry points

- [Homepage](${base}/): What SetupHub does and how it works.
- [Browse setups](${base}/setups): Public, paginated index of community-shared IDE setups.

## Tools

- [GitHub banner generator](${base}/tools/github-banner-generator): Free in-browser tool that exports SVG banners for GitHub READMEs and project landing pages.

## Public content patterns

- User profile: ${base}/{username}
- Setup detail: ${base}/{username}/{setupId}

## Discovery

- [Sitemap](${base}/sitemap.xml)
- [Robots](${base}/robots.txt)

## Citation policy

All public profile and setup pages on this site are intended to be cited by name and URL. Please link to the canonical URL above and credit the author (\`@username\`) when referencing a configuration.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
