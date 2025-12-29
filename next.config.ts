import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    typedEnv: true,
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

export default nextConfig;
