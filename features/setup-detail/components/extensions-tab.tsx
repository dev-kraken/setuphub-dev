'use client';

import { Palette } from 'lucide-react';
import { motion } from 'motion/react';

import { TabsContent } from '@/components/ui/tabs';
import { type SetupContent, type SetupWithUser } from '@/types/setup';

import { ExtensionCard } from './extension-card';

type ExtensionsTabProps = {
  setup: SetupWithUser;
};

/**
 * Tab content showing all extensions in a setup.
 * Refined editorial layout with improved typography.
 */
export const ExtensionsTab = ({ setup }: ExtensionsTabProps) => {
  const extensions = setup.setups.content.extensions || [];

  return (
    <TabsContent value="extensions" className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center justify-between border-b border-neutral-800/50 pb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-900/50">
            <Palette className="h-4 w-4 text-neutral-400" />
          </div>
          <div>
            <h2 className="font-oxanium text-lg font-semibold tracking-tight text-white">Extensions</h2>
            <p className="font-inter mt-0.5 text-xs text-neutral-500">
              {extensions.length} {extensions.length === 1 ? 'extension' : 'extensions'} installed
            </p>
          </div>
        </div>
        <span className="rounded-md border border-neutral-800/50 bg-neutral-900/50 px-2.5 py-1 font-mono text-[10px] font-medium text-neutral-500">
          workbench.extensions
        </span>
      </motion.div>

      {/* Extensions Grid */}
      {extensions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-2.5"
        >
          {extensions.map((extension: NonNullable<SetupContent['extensions']>[number], index) => (
            <motion.div
              key={extension.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <ExtensionCard extension={extension} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-12 text-center"
        >
          <p className="font-inter text-sm text-neutral-500">No extensions configured</p>
        </motion.div>
      )}
    </TabsContent>
  );
};
