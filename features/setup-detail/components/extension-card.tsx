import { type SetupContent } from '@/types/setup';

type ExtensionCardProps = {
  extension: NonNullable<SetupContent['extensions']>[number];
};

/**
 * Card displaying a single extension's info.
 */
export const ExtensionCard = ({ extension }: ExtensionCardProps) => {
  return (
    <div className="group flex items-center justify-between rounded border border-neutral-800 bg-neutral-900/30 p-3 transition-colors hover:bg-neutral-900/50">
      <div className="flex flex-col gap-0.5">
        <span className="font-oxanium text-sm font-medium text-neutral-200">{extension.name}</span>
        <span className="font-mono text-xs text-neutral-500">{extension.id}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 font-mono text-xs text-green-400">
          {extension.version}
        </span>
      </div>
    </div>
  );
};
