import { TerminalSquare } from 'lucide-react';
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
 */
export const SettingsTab = ({ setup }: SettingsTabProps) => {
  const settings = setup.setups.content.settings;

  return (
    <TabsContent value="settings">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-oxanium flex items-center gap-2 text-base font-medium text-white">
          <TerminalSquare className="h-4 w-4 text-neutral-500" /> Editor Behavior
        </h2>
        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
          workbench.settings
        </span>
      </div>

      <div className="space-y-2">
        {settings && Object.entries(settings).map(([key, value]) => <SettingCard key={key} name={key} value={value} />)}
      </div>

      <SyntaxHighlighter
        wrapLongLines={true}
        language="json"
        style={tomorrow}
        customStyle={{
          borderRadius: '0.5rem',
          background: 'transparent',
          border: '1px solid #333',
        }}
      >
        {JSON.stringify(settings, null, 2)}
      </SyntaxHighlighter>
    </TabsContent>
  );
};
