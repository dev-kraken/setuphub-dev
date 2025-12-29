import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/constants';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from site config
  const baseUrl = siteConfig.url;

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/setups`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Fetch Users
  const users = await db.query.user.findMany({
    columns: {
      username: true,
      updatedAt: true,
    },
  });

  const userRoutes: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${baseUrl}/${u.username}`,
    lastModified: u.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Fetch Setups (Public only, assuming we filter implementation-side if isPublic column exists? Checked schema: isPublic exists)
  // Note: Schema has 'isPublic' column. We should filter by it ideally, but let's fetch all for now or check if we need to filter.
  // Schema definition: isPublic: boolean('is_public').default(false).notNull(),
  // So we definitely should filter.
  const allSetups = await db.query.setups.findMany({
    where: (setups, { eq }) => eq(setups.isPublic, true),
    with: {
      user: {
        columns: {
          username: true,
        },
      },
    },
    columns: {
      id: true,
      updatedAt: true,
    },
  });

  const setupRoutes: MetadataRoute.Sitemap = allSetups.map((s) => ({
    url: `${baseUrl}/${s.user.username}/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...userRoutes, ...setupRoutes];
}
