'use client';

import { IconBox, IconLoader2 } from '@tabler/icons-react';
import { motion } from 'motion/react';
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
 * Refined design with staggered load animations.
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[400px] items-center justify-center rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-12 backdrop-blur-sm"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-neutral-800/50 bg-neutral-900/50">
              <IconBox className="size-8 text-neutral-500" />
            </div>
          </div>
          <h3 className="font-oxanium mb-2 text-lg font-semibold text-white">No public setups found</h3>
          <p className="font-inter text-sm text-neutral-500">Be the first to share your setup with the community.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Setups Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {setups.map((setup, index) => (
          <motion.div
            key={setup.setups.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <PublicSetupCard setup={setup} />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isPending}
            className="min-w-[160px] border-neutral-800/50 bg-neutral-900/30 font-medium text-neutral-300 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 hover:text-white"
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
        </motion.div>
      )}
    </div>
  );
};

ExploreSetupsGrid.displayName = 'ExploreSetupsGrid';

export { ExploreSetupsGrid };
