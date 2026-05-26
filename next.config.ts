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
