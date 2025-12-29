import type { Metadata, Viewport } from 'next';
import type { Organization, Person, Product, WebPage, WebSite, WithContext } from 'schema-dts';

// ============================================================================
// TYPES
// ============================================================================

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  locale?: string;
  author?: {
    name: string;
    url?: string;
    twitter?: string;
  };
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  icons?: {
    icon?: string;
    shortcut?: string;
    apple?: string;
    other?: { rel: string; url: string }[];
  };
  verification?: {
    google?: string;
    yandex?: string;
    bing?: string;
  };
  creator?: string;
  publisher?: string;
  manifest?: string;
  appleWebApp?: {
    capable?: boolean;
    title?: string;
    statusBarStyle?: 'default' | 'black' | 'black-translucent';
    startupImage?: string[];
  };
}

export interface MetadataParams {
  title?: string | { default: string; template: string };
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string | { url: string; width?: number; height?: number; alt?: string };
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: Array<{ name: string; url?: string }> | string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  locale?: string;
  alternateLocales?: string[];
  icons?: SiteConfig['icons'];
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  openGraph?: {
    type?: 'website' | 'article' | 'profile';
    locale?: string;
    siteName?: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
}

export type StructuredDataType =
  | WithContext<WebPage>
  | WithContext<WebSite>
  | WithContext<Organization>
  | WithContext<Product>
  | WithContext<Person>;

// ============================================================================
// UTILITIES
// ============================================================================

function absoluteUrl(path: string | undefined, baseUrl: string): string {
  if (!path) return baseUrl;
  if (path.startsWith('http')) return path;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// ============================================================================
// VIEWPORT
// ============================================================================

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  };
}

// ============================================================================
// METADATA CONSTRUCTION
// ============================================================================

export function constructMetadata(siteConfig: SiteConfig, params: MetadataParams = {}): Metadata {
  const {
    title = siteConfig.title,
    description = siteConfig.description,
    keywords = siteConfig.keywords,
    url,
    image = siteConfig.ogImage,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noIndex = false,
    noFollow = false,
    canonical,
    locale = siteConfig.locale ?? 'en_US',
    alternateLocales = [],
    icons = siteConfig.icons,
    twitter,
    openGraph,
  } = params;

  const baseUrl = siteConfig.url;
  const pageUrl = absoluteUrl(url, baseUrl);
  const canonicalUrl = canonical ?? pageUrl;

  const imageUrl = typeof image === 'string' ? image : image.url;
  const finalImageUrl = imageUrl.startsWith('http') ? imageUrl : absoluteUrl(imageUrl, baseUrl);
  const imageWidth = typeof image === 'string' ? 1200 : (image.width ?? 1200);
  const imageHeight = typeof image === 'string' ? 630 : (image.height ?? 630);

  const titleString = typeof title === 'string' ? title : title.default;
  const imageAlt = typeof image === 'string' ? titleString : (image.alt ?? titleString);

  const normalizedAuthors = authors
    ? authors.map((a) => (typeof a === 'string' ? { name: a } : a))
    : siteConfig.author
      ? [{ name: siteConfig.author.name, url: siteConfig.author.url }]
      : undefined;

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: normalizedAuthors,
    creator: siteConfig.creator ?? siteConfig.author?.name,
    publisher: siteConfig.publisher ?? siteConfig.author?.name,
    icons,
    openGraph: {
      type: openGraph?.type ?? type,
      locale: openGraph?.locale ?? locale,
      url: pageUrl,
      title: titleString,
      description,
      siteName: openGraph?.siteName ?? siteConfig.name,
      images: openGraph?.images ?? [
        {
          url: finalImageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: twitter?.card ?? 'summary_large_image',
      site: twitter?.site ?? siteConfig.social?.twitter,
      creator: twitter?.creator ?? siteConfig.social?.twitter,
      title: titleString,
      description,
      images: [finalImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      ...(alternateLocales.length > 0 && {
        languages: Object.fromEntries(
          alternateLocales.map((loc) => [loc, absoluteUrl(url ? `/${loc}${url}` : `/${loc}`, baseUrl)]),
        ),
      }),
    },
    ...(siteConfig.verification && { verification: siteConfig.verification }),
    ...(siteConfig.manifest && { manifest: siteConfig.manifest }),
    ...(siteConfig.appleWebApp && { appleWebApp: siteConfig.appleWebApp }),
  };

  if (noIndex || noFollow) {
    metadata.robots = {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  }

  return metadata;
}

// ============================================================================
// TITLE TEMPLATE
// ============================================================================

export function createTitleTemplate(siteName: string, separator = '|'): { default: string; template: string } {
  return {
    default: siteName,
    template: `%s ${separator} ${siteName}`,
  };
}

// ============================================================================
// JSON-LD STRUCTURED DATA
// ============================================================================

export function generateOrganizationSchema(config: SiteConfig): WithContext<Organization> {
  const baseUrl = normalizeBaseUrl(config.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logos/brand-light.svg`,
    },
    ...(config.social && {
      sameAs: Object.values(config.social).filter(Boolean) as string[],
    }),
    ...(config.author && {
      founder: {
        '@type': 'Person',
        name: config.author.name,
        ...(config.author.url && { url: config.author.url }),
      },
    }),
  };
}

export function generateWebSiteSchema(config: SiteConfig): WithContext<WebSite> {
  const baseUrl = normalizeBaseUrl(config.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: baseUrl,
    description: config.description,
    inLanguage: config.locale ?? 'en',
  };
}

export function generateWebPageSchema(
  siteConfig: SiteConfig,
  params: {
    title: string;
    description: string;
    url: string;
    image?: string;
    locale?: string;
    publishedTime?: string;
    modifiedTime?: string;
  },
): WithContext<WebPage> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const pageUrl = `${baseUrl}${params.url}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.title,
    description: params.description,
    url: pageUrl,
    ...(params.image && { image: params.image }),
    inLanguage: params.locale ?? siteConfig.locale ?? 'en',
    ...(params.publishedTime && { datePublished: params.publishedTime }),
    ...(params.modifiedTime && { dateModified: params.modifiedTime }),
  };
}

export function generatePersonSchema(
  siteConfig: SiteConfig,
  params: {
    name: string;
    username: string;
    image?: string | null;
    bio?: string | null;
    url: string;
    websiteUrl?: string | null;
    twitterUsername?: string | null;
    linkedinUrl?: string | null;
  },
): WithContext<Person> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const profileUrl = `${baseUrl}${params.url}`;

  const sameAs: string[] = [];
  if (params.websiteUrl) sameAs.push(params.websiteUrl);
  if (params.twitterUsername) sameAs.push(`https://x.com/${params.twitterUsername}`);
  if (params.linkedinUrl) sameAs.push(params.linkedinUrl);
  sameAs.push(`https://github.com/${params.username}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    url: profileUrl,
    ...(params.image && { image: params.image.startsWith('http') ? params.image : `${baseUrl}${params.image}` }),
    ...(params.bio && { description: params.bio }),
    ...(sameAs.length > 0 && { sameAs }),
    identifier: {
      '@type': 'PropertyValue',
      name: 'username',
      value: params.username,
    },
  };
}

export function generateSetupSchema(
  siteConfig: SiteConfig,
  params: {
    name: string;
    description?: string | null;
    url: string;
    authorName: string;
    authorUrl: string;
    editorName: string;
    editorLabel: string;
    createdAt: string;
    updatedAt?: string;
    image?: string | null;
    starCount?: number;
  },
): WithContext<Product> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const setupUrl = `${baseUrl}${params.url}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    description: params.description || `${params.name} - ${params.editorLabel} setup configuration`,
    url: setupUrl,
    ...(params.image && { image: params.image.startsWith('http') ? params.image : `${baseUrl}${params.image}` }),
    brand: {
      '@type': 'Brand',
      name: params.editorLabel,
    },
    category: 'Software Configuration',
    ...(params.starCount !== undefined && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: params.starCount > 0 ? '5' : '0',
        ratingCount: params.starCount,
      },
    }),
  };
}

export function sanitizeJsonLd(data: StructuredDataType): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
