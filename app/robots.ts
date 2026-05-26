import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og'],
      // Block private and write endpoints; `/api/og` stays crawlable so social
      // and AI preview bots can fetch share images.
      disallow: ['/dashboard/', '/api/auth/', '/api/setups', '/api/user/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
