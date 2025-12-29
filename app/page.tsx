import { Suspense } from 'react';

import { FeaturedProfilesSection, HeroSection, HowItWorksSection, VisualSection } from '@/features/marketing';
import { FeaturedProfilesSkeleton } from '@/features/marketing/components/skeletons';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <VisualSection />
      <Suspense fallback={<FeaturedProfilesSkeleton />}>
        <FeaturedProfilesSection />
      </Suspense>
    </main>
  );
}
