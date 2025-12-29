'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useCallback, useState, useTransition } from 'react';

import { PublicSetupCard } from '@/components/shared/public-setup-card';
import { Button } from '@/components/ui/button';
import { type SetupWithUser } from '@/types/setup';

import { getExploreSetups, type GetExploreSetupsResult } from '../actions/get-explore-setups';

interface ExploreSetupsGridProps {
  /** Initial data from server */
  initialData: GetExploreSetupsResult;
}

/**
 * ExploreSetupsGrid - Displays a grid of public setups with load more pagination.
 * Uses cursor-based pagination for efficient data fetching.
 */
const ExploreSetupsGrid = ({ initialData }: ExploreSetupsGridProps) => {
  const [setups, setSetups] = useState<SetupWithUser[]>(initialData.setups);
  const [cursor, setCursor] = useState<string | null>(initialData.nextCursor);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isPending, startTransition] = useTransition();

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return;

    startTransition(async () => {
      const result = await getExploreSetups({ cursor });
      setSetups((prev) => [...prev, ...result.setups]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    });
  }, [cursor, isPending]);

  if (setups.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30">
        <p className="text-sm text-neutral-500">No public setups found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Setups Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {setups.map((setup) => (
          <PublicSetupCard key={setup.setups.id} setup={setup} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isPending}
            className="min-w-[160px] border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            {isPending ? (
              <>
                <IconLoader2 className="mr-2 size-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

ExploreSetupsGrid.displayName = 'ExploreSetupsGrid';

export { ExploreSetupsGrid };
