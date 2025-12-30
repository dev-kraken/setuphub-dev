import type { SiteConfig } from '@/lib/metadata';

export const siteConfig: SiteConfig = {
  name: 'SetupHub | Share Your IDE Setup with the World',
  title: 'SetupHub - Share Your IDE Setup with the World',
  description:
    'Sync and share your VS Code, Cursor, or any IDE setup with the developer community. One-click backup of extensions, themes, and settings.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://setuphub.dev',
  ogImage: '/images/og/og-setuphub.png',
  keywords: ['vscode', 'ide', 'setup', 'extensions', 'themes', 'developer tools', 'sync', 'backup'],
  locale: 'en_US',
  author: {
    name: 'DevKraken',
    url: 'https://github.com/dev-kraken',
    twitter: '@devkraken',
  },
  social: {
    twitter: '@setuphub',
    github: 'https://github.com/dev-kraken/setuphub',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'SetupHub',
    statusBarStyle: 'black-translucent',
  },
};
