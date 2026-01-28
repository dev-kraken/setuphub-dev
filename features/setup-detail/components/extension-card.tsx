import { type SetupContent } from '@/types/setup';

type ExtensionCardProps = {
  extension: NonNullable<SetupContent['extensions']>[number];
};

/**
 * Card displaying a single extension's info.
 * Refined design with improved typography and subtle details.
 */
export const ExtensionCard = ({ extension }: ExtensionCardProps) => {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-4 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50">
      <div className="min-w-0 flex-1">
        <h3 className="font-oxanium mb-1 text-sm font-semibold text-white">{extension.name}</h3>
        <p className="font-mono text-xs text-neutral-500">{extension.id}</p>
      </div>
      <div className="shrink-0">
        <span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1 font-mono text-xs font-medium text-green-400">
          {extension.version}
        </span>
      </div>
    </div>
  );
};
