import { Skeleton } from '@/components/ui/skeleton';

/**
 * PublicSetupCardSkeleton - Loading skeleton for PublicSetupCard.
 * Matches the exact layout of the PublicSetupCard component.
 */
const PublicSetupCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0F0F0F]">
      {/* Top decorative header */}
      <div className="relative h-24 overflow-hidden bg-[#282828]">
        <Skeleton className="absolute inset-0" />
        <div className="absolute right-3 bottom-3">
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        {/* Avatar */}
        <div className="-mt-12 mb-3">
          <Skeleton className="size-16 rounded-full" />
        </div>

        {/* Header: title + username */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>

        {/* Setup details */}
        <div className="space-y-2">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

          {/* Font */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>

          <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

          {/* Font size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        </div>

        <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
};

PublicSetupCardSkeleton.displayName = 'PublicSetupCardSkeleton';

export { PublicSetupCardSkeleton };
