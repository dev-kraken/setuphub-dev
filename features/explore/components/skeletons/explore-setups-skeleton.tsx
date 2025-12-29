import { PublicSetupCardSkeleton } from './public-setup-card-skeleton';

interface ExploreSetupsSkeletonProps {
  /** Number of skeleton cards to display */
  count?: number;
}

/**
 * ExploreSetupsSkeleton - Loading skeleton for the explore setups grid.
 * Shows a grid of PublicSetupCardSkeleton components.
 */
const ExploreSetupsSkeleton = ({ count = 6 }: ExploreSetupsSkeletonProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PublicSetupCardSkeleton key={index} />
      ))}
    </div>
  );
};

ExploreSetupsSkeleton.displayName = 'ExploreSetupsSkeleton';

export { ExploreSetupsSkeleton };
