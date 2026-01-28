import { Suspense } from 'react';

import { JsonLd } from '@/components/shared/json-ld';
import { Separator } from '@/components/ui/separator';
import { ExploreSetupsLoader, ExploreSetupsSkeleton, UserSearch } from '@/features/explore';
import { siteConfig } from '@/lib/constants';
import { constructMetadata, generateWebPageSchema } from '@/lib/metadata';

export const metadata = constructMetadata(siteConfig, {
  title: 'Browse IDE Setups',
  description:
    'Discover and explore IDE setups shared by developers around the world. Find VS Code, Cursor, and other editor configurations to inspire your workflow.',
  url: '/setups',
  keywords: [
    ...siteConfig.keywords,
    'ide setups',
    'browse setups',
    'discover',
    'developer setups',
    'ide configurations',
    'community setups',
    'vscode setups',
    'cursor setups',
  ],
});

export default function SetupsPage() {
  return (
    <main className="mx-auto w-full py-4 md:max-w-7xl md:px-6 md:py-8 lg:px-8">
      <JsonLd
        data={generateWebPageSchema(siteConfig, {
          title: 'Browse IDE Setups',
          description:
            'Discover and explore IDE setups shared by developers around the world. Find VS Code, Cursor, and other editor configurations.',
          url: '/setups',
        })}
      />
      <section className="w-full px-0">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-oxanium mb-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Browse Setups
            </h1>
            <p className="font-inter text-base leading-relaxed text-neutral-400 md:text-lg">
              Discover setups from developers around the world
            </p>
          </div>
          <div className="shrink-0">
            <UserSearch placeholder="Search by username..." />
          </div>
        </div>
        <Separator className="mb-8 border-neutral-800/50" />

        {/* Public Setups Grid with Suspense */}
        <Suspense fallback={<ExploreSetupsSkeleton count={6} />}>
          <ExploreSetupsLoader />
        </Suspense>
      </section>
    </main>
  );
}
