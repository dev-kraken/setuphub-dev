'use client';

import { TerminalSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { TabsContent } from '@/components/ui/tabs';
import { type SetupWithUser } from '@/types/setup';

import { SettingCard } from './setting-card';

type SettingsTabProps = {
  setup: SetupWithUser;
};

/**
 * Tab content showing all settings in a setup.
 * Refined editorial layout with improved typography.
 */
export const SettingsTab = ({ setup }: SettingsTabProps) => {
  const settings = setup.setups.content.settings;
  const settingsEntries = settings ? Object.entries(settings) : [];

  return (
    <TabsContent value="settings" className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center justify-between border-b border-neutral-800/50 pb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-900/50">
            <TerminalSquare className="h-4 w-4 text-neutral-400" />
          </div>
          <div>
            <h2 className="font-oxanium text-lg font-semibold tracking-tight text-white">Editor Behavior</h2>
            <p className="font-inter mt-0.5 text-xs text-neutral-500">Configured settings and preferences</p>
          </div>
        </div>
        <span className="rounded-md border border-neutral-800/50 bg-neutral-900/50 px-2.5 py-1 font-mono text-[10px] font-medium text-neutral-500">
          workbench.settings
        </span>
      </motion.div>

      {/* Settings Cards */}
      {settingsEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-2.5"
        >
          {settingsEntries.map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <SettingCard name={key} value={value} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* JSON View */}
      {settings && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-oxanium text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Raw Configuration
            </h3>
          </div>
          <SyntaxHighlighter
            wrapLongLines={true}
            language="json"
            style={tomorrow}
            customStyle={{
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {JSON.stringify(settings, null, 2)}
          </SyntaxHighlighter>
        </motion.div>
      )}
    </TabsContent>
  );
};
