import { Skeleton } from '@/components/ui/skeleton';

const SetupLayoutSkeleton = () => {
  return (
    <section className="z-20 mx-auto max-w-6xl">
      <div className="grid min-h-[calc(100vh-10rem)] grid-cols-1 gap-2 lg:grid-cols-12">
        {/* Sidebar Skeleton */}
        <div className="flex flex-col space-y-3 rounded-xl border border-neutral-800 p-5 lg:col-span-3">
          {/* User avatar and info */}
          <div className="flex w-full items-center justify-between text-center">
            <Skeleton className="size-18 rounded-full" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

          {/* Setup info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-12 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-14 rounded-md" />
            </div>

            <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

            {/* Appearance section */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Theme card */}
            <div className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>

            {/* Font card */}
            <div className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Font size card */}
            <div className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>

          <div className="h-px w-full border-t border-dashed border-neutral-800/50" />

          {/* Tabs */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Last synced */}
          <div className="mt-auto border-t border-neutral-800 pt-6">
            <div className="space-y-2 rounded border border-neutral-800 bg-neutral-900 p-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col rounded-xl border border-neutral-800 lg:col-span-9">
          <div className="space-y-4 px-6 py-4">
            {/* Settings header */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Settings grid */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-neutral-800 p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SetupLayoutSkeleton.displayName = 'SetupLayoutSkeleton';
export { SetupLayoutSkeleton };
