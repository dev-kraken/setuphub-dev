import { Palette } from 'lucide-react';

import { TabsContent } from '@/components/ui/tabs';
import { type SetupContent, type SetupWithUser } from '@/types/setup';

import { ExtensionCard } from './extension-card';

type ExtensionsTabProps = {
  setup: SetupWithUser;
};

/**
 * Tab content showing all extensions in a setup.
 */
export const ExtensionsTab = ({ setup }: ExtensionsTabProps) => {
  const extensions = setup.setups.content.extensions || [];

  return (
    <TabsContent value="extensions">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-oxanium flex items-center gap-2 text-base font-medium text-white">
          <Palette className="h-4 w-4 text-neutral-500" /> Extensions
        </h2>
        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
          workbench.extensions
        </span>
      </div>

      <div className="space-y-2">
        {extensions.map((extension: NonNullable<SetupContent['extensions']>[number]) => (
          <ExtensionCard key={extension.id} extension={extension} />
        ))}
      </div>
    </TabsContent>
  );
};
