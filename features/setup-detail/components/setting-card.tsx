'use client';

import { cn } from '@/lib/utils';

import { useHumanize } from '../hooks/use-humanize';

type SettingCardProps = {
  name: string;
  value: unknown;
};

/**
 * Card displaying a single editor setting.
 */
export const SettingCard = ({ name, value }: SettingCardProps) => {
  return <RenderSettingCard name={name} value={value as string} />;
};

const RenderSettingCard = ({ name, value }: { name: string; value: string }) => {
  const humanizedName = useHumanize(name);

  const showOnlyTheseKeys = [
    'editor.fontLigatures',
    'editor.tabSize',
    'editor.wordWrap',
    'editor.formatOnSave',
    'editor.fontLigatures',
  ];

  if (!showOnlyTheseKeys.includes(name)) return null;
  if (!value || value === '' || value === 'undefined' || value === 'null' || value.length === 0) return null;

  return (
    <div
      key={name}
      className="group flex items-center justify-between rounded border border-neutral-800 bg-neutral-900/30 p-3 transition-colors hover:bg-neutral-900/50"
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-oxanium text-sm font-medium text-neutral-200">{humanizedName}</span>
        <span className="font-mono text-xs text-neutral-500">{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'rounded border px-1.5 py-0.5 font-mono text-xs',
            typeof value === 'boolean'
              ? value
                ? 'border-green-500/20 bg-green-500/10 text-green-400'
                : 'border-red-500/20 bg-red-500/10 text-red-400'
              : typeof value === 'number'
                ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                : 'border-orange-500/20 bg-orange-500/10 text-orange-400',
          )}
        >
          {typeof value === 'boolean' ? (value ? 'true' : 'false') : typeof value === 'number' ? value : 'off'}
        </span>
      </div>
    </div>
  );
};
