import { JsonLd } from '@/components/shared/json-ld';
import { BannerEditorPage } from '@/features/banner-editor';
import { siteConfig } from '@/lib/constants';
import { constructMetadata, generateWebPageSchema } from '@/lib/metadata';

const PAGE_TITLE = 'GitHub Banner Generator';
const PAGE_DESCRIPTION =
  'Create custom SVG banners for GitHub and project READMEs. Free GitHub banner generator with themes, fonts, and icons. Export and use in repos.';
const PAGE_URL = '/tools/github-banner-generator';

export const metadata = constructMetadata(siteConfig, {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  keywords: [
    ...siteConfig.keywords,
    'GitHub banner generator',
    'GitHub banner',
    'README banner',
    'SVG banner generator',
    'repo banner',
    'project banner',
    'developer banner',
    'custom banner',
    'open source banner',
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={generateWebPageSchema(siteConfig, {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: PAGE_URL,
        })}
      />
      <main id="main" aria-label="GitHub banner generator">
        <header className="mx-auto max-w-7xl px-8 pt-8 pb-2">
          <h1 className="font-oxanium text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {PAGE_TITLE}
          </h1>
          <p className="font-inter mt-1 text-lg leading-relaxed font-light text-neutral-300">
            {PAGE_DESCRIPTION}
          </p>
        </header>
        <BannerEditorPage />
      </main>
    </>
  );
}
