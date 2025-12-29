import { Skeleton } from '@/components/ui/skeleton';

const PublicSetupCardSkeleton = () => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0F0F0F]">
      {/* Top decorative header */}
      <div className="relative h-24 overflow-hidden bg-[#282828]">
        <div className="absolute right-3 bottom-3 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col space-y-4 p-5">
        {/* Avatar */}
        <Skeleton className="-mt-12 mb-3 size-16 rounded-full" />

        {/* Header: title + username */}
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          {/* Star button */}
          <Skeleton className="h-8 w-14 rounded-md" />
        </header>

        {/* Setup details */}
        <section className="space-y-2">
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
            <Skeleton className="h-3 w-20" />
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
        </section>

        <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

        {/* Footer */}
        <footer className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </footer>
      </div>
    </article>
  );
};

PublicSetupCardSkeleton.displayName = 'PublicSetupCardSkeleton';
export { PublicSetupCardSkeleton };
