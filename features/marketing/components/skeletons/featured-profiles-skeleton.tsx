import { PublicSetupCardSkeleton } from '@/components/shared/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProfilesSkeleton = () => {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 py-12">
      <div className="flex flex-col gap-2 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-12 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PublicSetupCardSkeleton />
        <PublicSetupCardSkeleton />
        <PublicSetupCardSkeleton />
      </div>
    </section>
  );
};

FeaturedProfilesSkeleton.displayName = 'FeaturedProfilesSkeleton';
export { FeaturedProfilesSkeleton };
