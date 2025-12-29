import { Skeleton } from '@/components/ui/skeleton';

const DashboardSetupCardSkeleton = () => {
  return (
    <div className="glass-card gap-5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          {/* IDE Icon */}
          <Skeleton className="size-12 rounded-lg" />
          <div className="space-y-2">
            {/* Setup name */}
            <Skeleton className="h-6 w-32" />
            {/* Updated time */}
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {/* Badge */}
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Separator */}
      <div className="my-5 h-px w-full border-t border-dashed border-neutral-800/50" />

      {/* Content - Theme, Font, Extensions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Separator */}
      <div className="my-5 h-px w-full border-t border-dashed border-neutral-800/50" />

      {/* Footer - Star button and delete */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
};

DashboardSetupCardSkeleton.displayName = 'DashboardSetupCardSkeleton';
export { DashboardSetupCardSkeleton };
