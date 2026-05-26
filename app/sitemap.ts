import type { MetadataRoute } from 'next';

import { getAllPostSummaries } from '@/features/blog';
import { siteConfig } from '@/lib/constants';
import { db } from '@/lib/db';

// Evaluated once per build/regeneration so every static entry shares the same lastModified.
const GENERATED_AT = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: GENERATED_AT, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/setups`, lastModified: GENERATED_AT, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: GENERATED_AT, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${baseUrl}/tools/github-banner-generator`,
      lastModified: GENERATED_AT,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const [users, publicSetups, blogPosts] = await Promise.all([
    db.query.user
      .findMany({ columns: { username: true, updatedAt: true } })
      .catch((error: unknown) => {
        console.error('sitemap: failed to fetch users', error);
        return [] as { username: string; updatedAt: Date | null }[];
      }),
    db.query.setups
      .findMany({
        where: (setups, { eq }) => eq(setups.isPublic, true),
        with: { user: { columns: { username: true } } },
        columns: { id: true, updatedAt: true },
      })
      .catch((error: unknown) => {
        console.error('sitemap: failed to fetch public setups', error);
        return [] as { id: string; updatedAt: Date | null; user: { username: string } }[];
      }),
    // File-system reads can't really fail at build time, but mirror the
    // pattern for resilience if posts are ever moved to a remote store.
    getAllPostSummaries().catch((error: unknown) => {
      console.error('sitemap: failed to load blog posts', error);
      return [];
    }),
  ]);

  const userRoutes: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${baseUrl}/${u.username}`,
    lastModified: u.updatedAt ?? GENERATED_AT,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const setupRoutes: MetadataRoute.Sitemap = publicSetups.map((s) => ({
    url: `${baseUrl}/${s.user.username}/${s.id}`,
    lastModified: s.updatedAt ?? GENERATED_AT,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.meta.updatedAt ?? post.meta.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...userRoutes, ...setupRoutes, ...blogRoutes];
}
