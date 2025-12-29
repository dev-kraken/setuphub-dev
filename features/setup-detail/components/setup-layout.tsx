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
 */
export const SetupLayout = ({ setup }: SetupLayoutProps) => {
  return (
    <section className="z-20 mx-auto max-w-6xl">
      <Tabs defaultValue="settings" className="grid min-h-[calc(100vh-10rem)] grid-cols-1 lg:grid-cols-12">
        <SetupSidebar setup={setup} />
        <div className="flex flex-col rounded-xl border border-neutral-800 lg:col-span-9">
          <ScrollArea className="max-h-full px-6 py-4 md:max-h-[calc(100vh-10.5rem)] [&_[data-slot=scroll-area-viewport]>div]:block!">
            <SettingsTab setup={setup} />
            <ExtensionsTab setup={setup} />
          </ScrollArea>
        </div>
      </Tabs>
    </section>
  );
};
