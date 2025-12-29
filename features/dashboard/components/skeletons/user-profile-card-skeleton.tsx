import { Skeleton } from '@/components/ui/skeleton';

const UserProfileCardSkeleton = () => {
  return (
    <div className="glass-card hover:glass-card-hover rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Skeleton className="size-18 rounded-full" />
          <div className="space-y-2">
            {/* Name */}
            <Skeleton className="h-6 w-32" />
            {/* Username */}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        {/* Logout button */}
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
};

UserProfileCardSkeleton.displayName = 'UserProfileCardSkeleton';
export { UserProfileCardSkeleton };
