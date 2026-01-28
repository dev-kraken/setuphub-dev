'use client';

import { IconBox } from '@tabler/icons-react';
import { motion } from 'motion/react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

const EmptyUserSetupCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Empty className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-12 backdrop-blur-sm">
        <EmptyHeader className="items-center">
          <EmptyMedia variant="default">
            <div className="flex size-16 items-center justify-center rounded-full border border-neutral-800/50 bg-neutral-900/50">
              <IconBox className="size-8 text-neutral-500" />
            </div>
          </EmptyMedia>
          <EmptyTitle className="font-oxanium mt-4 text-xl font-semibold text-white">No public setups</EmptyTitle>
          <EmptyDescription className="font-inter mt-2 text-sm text-neutral-400">
            This user hasn't shared any setups yet.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </motion.div>
  );
};

export { EmptyUserSetupCard };
