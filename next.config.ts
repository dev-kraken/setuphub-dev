import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  // `.mdx` files in `features/blog/content/posts` are imported as modules,
  // not treated as page files — so we deliberately do NOT extend `pageExtensions`.
  experimental: {
    typedEnv: true,
    // Defer importing the full barrels of these icon/animation/utility packages
    // until each named export is actually referenced. Cuts JS shipped to the
    // client noticeably on icon-heavy routes.
    optimizePackageImports: ['@tabler/icons-react', 'lucide-react', 'motion', 'date-fns'],
  },
  // Blog routes call `fs.readdirSync` / `fs.readFileSync` against the MDX
  // content directory at request time. Next.js's file tracer can't infer those
  // inputs from `readdirSync`, so the .mdx files aren't shipped into the
  // serverless function bundle by default — production hits ENOENT on
  // `/var/task/features/blog/content/posts`. Include them explicitly for every
  // route that touches the post loader.
  outputFileTracingIncludes: {
    '/blog': ['./features/blog/content/posts/**/*.mdx'],
    '/blog/[slug]': ['./features/blog/content/posts/**/*.mdx'],
    '/rss.xml': ['./features/blog/content/posts/**/*.mdx'],
    '/llms.txt': ['./features/blog/content/posts/**/*.mdx'],
    '/sitemap.xml': ['./features/blog/content/posts/**/*.mdx'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'esbenp.gallerycdn.vsassets.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
