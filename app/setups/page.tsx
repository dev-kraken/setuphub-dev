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
    <>
      <JsonLd
        data={generateWebPageSchema(siteConfig, {
          title: 'Browse IDE Setups',
          description:
            'Discover and explore IDE setups shared by developers around the world. Find VS Code, Cursor, and other editor configurations.',
          url: '/setups',
        })}
      />
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-oxanium text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              Browse Setups
            </h1>
            <p className="font-inter mt-1 text-lg leading-relaxed font-light text-neutral-300">
              Discover setups from developers around the world
            </p>
          </div>
          <UserSearch placeholder="Search by username..." />
        </div>
        <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />

        {/* Public Setups Grid with Suspense */}
        <Suspense fallback={<ExploreSetupsSkeleton count={6} />}>
          <ExploreSetupsLoader />
        </Suspense>
      </section>
    </>
  );
}
