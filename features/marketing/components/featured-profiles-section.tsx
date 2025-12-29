import { PublicSetupCard } from '@/components/shared/public-setup-card';

import { getPublicSetups } from '../actions/get-public-setups';

const FeaturedProfilesSection = async () => {
  const publicSetups = await getPublicSetups();

  return (
    <section
      id="featured-profiles"
      className="mx-auto max-w-6xl space-y-8 py-12"
      aria-labelledby="featured-profiles-heading"
    >
      <div className="text-center">
        <h2
          id="featured-profiles-heading"
          className="font-oxanium text-2xl leading-tight font-semibold tracking-tight md:text-3xl"
        >
          Community Favorites
        </h2>
        <p className="font-inter mx-auto max-w-xl text-lg leading-relaxed font-light text-neutral-300">
          Discover how top developers configure their IDEs. View settings by GitHub username, like your favorites, and
          apply them instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicSetups && publicSetups.map((setup) => <PublicSetupCard key={setup.setups.id} setup={setup} />)}
      </div>
    </section>
  );
};

FeaturedProfilesSection.displayName = 'FeaturedProfilesSection';
export { FeaturedProfilesSection };
