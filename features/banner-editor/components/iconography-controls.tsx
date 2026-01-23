'use client';

import { memo, useMemo } from 'react';

import { cn } from '@/lib/utils';

import { ICON_MAP, type IconName } from '../lib/constants';
import type { IconographyControlsProps } from '../types';

export const IconographyControls = memo(function IconographyControls({
  selectedIcon,
  onIconChange,
}: IconographyControlsProps) {
  const iconNames = useMemo(
    () => Object.keys(ICON_MAP) as IconName[],
    []
  );

  return (
    <div
      className="grid grid-cols-6 gap-3 max-h-56 overflow-y-auto pr-2 pb-2 custom-scrollbar"
      role="radiogroup"
      aria-label="Icon selection"
    >
      {iconNames.map((iconName) => {
        const IconComp = ICON_MAP[iconName];
        return (
          <button
            key={iconName}
            onClick={() => onIconChange(iconName)}
            className={cn(
              'aspect-square rounded-lg flex items-center justify-center transition-all duration-200 min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
              selectedIcon === iconName
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-black/20 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200'
            )}
            title={iconName}
            aria-label={`Select ${iconName} icon`}
            role="radio"
            aria-checked={selectedIcon === iconName}
          >
            <IconComp className="w-6 h-6" stroke={1.5} />
          </button>
        );
      })}
    </div>
  );
});

IconographyControls.displayName = 'IconographyControls';
