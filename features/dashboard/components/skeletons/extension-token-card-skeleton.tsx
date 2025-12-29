import { Key } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

const ExtensionTokenCardSkeleton = () => {
  return (
    <div className="glass-card hover:glass-card-hover group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
        <Key className="h-12 w-12 text-white" />
      </div>
      {/* Title */}
      <Skeleton className="mb-4 h-4 w-24" />
      {/* Token display area */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

ExtensionTokenCardSkeleton.displayName = 'ExtensionTokenCardSkeleton';
export { ExtensionTokenCardSkeleton };
