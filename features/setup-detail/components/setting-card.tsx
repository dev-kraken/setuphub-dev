'use client';

import { cn } from '@/lib/utils';

import { useHumanize } from '../hooks/use-humanize';

type SettingCardProps = {
  name: string;
  value: unknown;
};

/**
 * Card displaying a single editor setting.
 * Refined design with improved typography and subtle details.
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

  const getValueType = () => {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'error';
    }
    if (typeof value === 'number') {
      return 'info';
    }
    return 'warning';
  };

  const valueType = getValueType();

  return (
    <div className="group flex items-center justify-between gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-4 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50">
      <div className="min-w-0 flex-1">
        <h3 className="font-oxanium mb-1 text-sm font-semibold text-white">{humanizedName}</h3>
        <p className="font-mono text-xs text-neutral-500">{name}</p>
      </div>
      <div className="shrink-0">
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-medium',
            valueType === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : valueType === 'error'
                ? 'border-red-500/20 bg-red-500/10 text-red-400'
                : valueType === 'info'
                  ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                  : 'border-orange-500/20 bg-orange-500/10 text-orange-400',
          )}
        >
          {typeof value === 'boolean' ? (value ? 'true' : 'false') : typeof value === 'number' ? value : String(value)}
        </span>
      </div>
    </div>
  );
};
