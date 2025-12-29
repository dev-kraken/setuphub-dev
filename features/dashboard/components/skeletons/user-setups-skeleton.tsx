import { IconSettingsHeart } from '@tabler/icons-react';

import { Skeleton } from '@/components/ui/skeleton';

import { DashboardSetupCardSkeleton } from './dashboard-setup-card-skeleton';

const UserSetupsSkeleton = () => {
  return (
    <div className="glass-card hover:glass-card-hover group relative space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
        <IconSettingsHeart className="h-12 w-12 text-white" />
      </div>
      <div className="space-y-2">
        {/* Title */}
        <Skeleton className="h-6 w-32" />
        {/* Description */}
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Setup cards grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DashboardSetupCardSkeleton />
        <DashboardSetupCardSkeleton />
      </div>
    </div>
  );
};

UserSetupsSkeleton.displayName = 'UserSetupsSkeleton';
export { UserSetupsSkeleton };
