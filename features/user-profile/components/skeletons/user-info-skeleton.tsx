import { Skeleton } from '@/components/ui/skeleton';

const UserInfoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 items-center gap-5 py-5 md:grid-cols-3">
      {/* User Profile Section */}
      <div className="col-span-2 flex flex-1 items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <Skeleton className="h-20 w-20 rounded-full md:h-28 md:w-28" />
          <Skeleton className="absolute right-2 bottom-1 h-5 w-5 rounded-full" />
        </div>

        {/* User Details */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex w-full items-center gap-3 md:w-auto">
        {/* Setups Count */}
        <div className="min-w-[120px] flex-1 rounded-xl border border-white/5 px-5 py-3 md:flex-none">
          <div className="mb-1.5 flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        {/* Stars Count */}
        <div className="min-w-[120px] flex-1 rounded-xl border border-white/5 bg-white/2 px-5 py-3 md:flex-none">
          <div className="mb-1.5 flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

UserInfoSkeleton.displayName = 'UserInfoSkeleton';
export { UserInfoSkeleton };
