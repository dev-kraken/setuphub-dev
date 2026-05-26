'use client';

import { memo, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

import { PRESET_COLORS } from '../lib/constants';
import { type AppearanceControlsProps, THEME, type Theme } from '../types';

export const AppearanceControls = memo(function AppearanceControls({
  theme,
  accentColor,
  onThemeChange,
  onAccentColorChange,
}: AppearanceControlsProps) {
  const handleThemeChange = useCallback(
    (value: string) => {
      if (value) {
        onThemeChange(value as Theme);
      }
    },
    [onThemeChange],
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAccentColorChange(e.target.value);
    },
    [onAccentColorChange],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="font-oxanium mb-3 block text-sm font-medium text-neutral-400">Theme</Label>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={handleThemeChange}
          className="flex w-full gap-2 rounded-xl border border-white/5 bg-black/40 p-1"
          aria-label="Theme selection"
        >
          <ToggleGroupItem
            value={THEME.LIGHT}
            aria-label="Light theme"
            className={cn(
              'flex-1 rounded-lg py-3 text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none',
              theme === THEME.LIGHT
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300',
            )}
          >
            Light
          </ToggleGroupItem>
          <ToggleGroupItem
            value={THEME.DARK}
            aria-label="Dark theme"
            className={cn(
              'flex-1 rounded-lg py-3 text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none',
              theme === THEME.DARK
                ? 'border border-white/5 bg-neutral-800 text-white shadow-lg shadow-black/50'
                : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300',
            )}
          >
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <Label className="font-oxanium mb-3 block text-sm font-medium text-neutral-400">Accent Color</Label>
        <div className="flex flex-wrap gap-3 px-2" role="radiogroup" aria-label="Accent color selection">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onAccentColorChange(color)}
              className={cn(
                'size-10 rounded-full border-2 transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                accentColor === color
                  ? 'scale-110 border-white shadow-lg shadow-white/20'
                  : 'border-transparent hover:border-white/20',
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} color`}
              role="radio"
              aria-checked={accentColor === color}
            />
          ))}
          <div className="relative size-10 overflow-hidden rounded-full border-2 border-neutral-700 transition-colors focus-within:ring-2 focus-within:ring-white/50 focus-within:ring-offset-2 focus-within:ring-offset-black hover:border-neutral-500">
            <input
              type="color"
              value={accentColor}
              onChange={handleColorChange}
              className="absolute -top-2 -left-2 size-16 cursor-pointer opacity-0"
              aria-label="Custom color picker"
            />
            <div className="size-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
});

AppearanceControls.displayName = 'AppearanceControls';
