'use client';

import { motion } from 'motion/react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs } from '@/components/ui/tabs';
import { type SetupWithUser } from '@/types/setup';

import { ExtensionsTab } from './extensions-tab';
import { SettingsTab } from './settings-tab';
import { SetupSidebar } from './setup-sidebar';

type SetupLayoutProps = {
  setup: SetupWithUser;
};

/**
 * Main layout component for the setup detail page.
 * Refined editorial design with subtle load animations.
 */
export const SetupLayout = ({ setup }: SetupLayoutProps) => {
  return (
    <section className="relative z-20 mx-auto w-full px-0 py-8 md:max-w-7xl md:px-6 md:py-12 lg:px-8">
      <Tabs defaultValue="settings" className="grid min-h-[calc(100vh-14rem)] grid-cols-1 gap-4 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3"
        >
          <SetupSidebar setup={setup} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:col-span-9"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-800/50 bg-[#0A0A0A]/50 shadow-2xl ring-1 ring-white/5 backdrop-blur-sm">
            <ScrollArea className="flex-1 px-6 py-6 md:max-h-[calc(100vh-14rem)] [&_[data-slot=scroll-area-viewport]>div]:block!">
              <SettingsTab setup={setup} />
              <ExtensionsTab setup={setup} />
            </ScrollArea>
          </div>
        </motion.div>
      </Tabs>
    </section>
  );
};
