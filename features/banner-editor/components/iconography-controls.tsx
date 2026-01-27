'use client';

import { memo } from 'react';

import type { IconographyControlsProps } from '../types';
import { IconPicker } from './icon-picker';

export const IconographyControls = memo(function IconographyControls({
  selectedIcon,
  onIconChange,
}: IconographyControlsProps) {
  return (
    <IconPicker
      value={selectedIcon}
      onChange={onIconChange}
      aria-label="Icon selection"
    />
  );
});

IconographyControls.displayName = 'IconographyControls';
