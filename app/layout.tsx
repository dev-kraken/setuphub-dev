import '@/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';

import { AppBackground } from '@/components/layouts/app-background';
import SiteFooter from '@/components/layouts/site-footer';
import SiteHeader from '@/components/layouts/site-header';
import { ThemeProvider } from '@/components/providers';
import { JsonLd } from '@/components/shared/json-ld';
import { Toaster } from '@/components/ui/sonner';
import { inter, oxanium } from '@/fonts';
import { siteConfig } from '@/lib/constants';
import {
  constructMetadata,
  createTitleTemplate,
  generateOrganizationSchema,
  generateViewport,
  generateWebSiteSchema,
} from '@/lib/metadata';

export const viewport = generateViewport();

export const metadata = constructMetadata(siteConfig, {
  title: createTitleTemplate(siteConfig.name),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={[generateOrganizationSchema(siteConfig), generateWebSiteSchema(siteConfig)]} />
      </head>
      <body className={`${inter.variable} ${oxanium.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppBackground>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="relative flex-1 overflow-hidden px-6 py-20">{children}</main>
              <SiteFooter />
            </div>
            <Toaster richColors={true} />
          </AppBackground>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-D0MJV3MV1K" />
      </body>
    </html>
  );
}
