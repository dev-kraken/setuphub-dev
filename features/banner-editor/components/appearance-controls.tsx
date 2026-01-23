'use client';

import { memo, useCallback } from 'react';

import { cn } from '@/lib/utils';

import { PRESET_COLORS } from '../lib/constants';
import { type AppearanceControlsProps,THEME } from '../types';

export const AppearanceControls = memo(function AppearanceControls({
  theme,
  accentColor,
  onThemeChange,
  onAccentColorChange,
}: AppearanceControlsProps) {
  const handleLightTheme = useCallback(() => {
    onThemeChange(THEME.LIGHT);
  }, [onThemeChange]);

  const handleDarkTheme = useCallback(() => {
    onThemeChange(THEME.DARK);
  }, [onThemeChange]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAccentColorChange(e.target.value);
    },
    [onAccentColorChange]
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-neutral-400 mb-3 block">
          Theme
        </label>
        <div
          className="flex gap-2 p-1 bg-black/40 rounded-xl w-full border border-white/5"
          role="radiogroup"
          aria-label="Theme selection"
        >
          <button
            onClick={handleLightTheme}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
              theme === THEME.LIGHT
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            )}
            role="radio"
            aria-checked={theme === THEME.LIGHT}
            aria-label="Light theme"
          >
            Light
          </button>
          <button
            onClick={handleDarkTheme}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
              theme === THEME.DARK
                ? 'bg-neutral-800 text-white shadow-lg shadow-black/50 border border-white/5'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            )}
            role="radio"
            aria-checked={theme === THEME.DARK}
            aria-label="Dark theme"
          >
            Dark
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-400 mb-3 block">
          Accent Color
        </label>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color selection">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onAccentColorChange(color)}
              className={cn(
                'w-10 h-10 rounded-full border-2 transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white/50',
                accentColor === color
                  ? 'border-white scale-110 shadow-lg shadow-white/20'
                  : 'border-transparent hover:border-white/20'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} color`}
              role="radio"
              aria-checked={accentColor === color}
            />
          ))}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-700 hover:border-neutral-500 transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-black focus-within:ring-white/50">
            <input
              type="color"
              value={accentColor}
              onChange={handleColorChange}
              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
              aria-label="Custom color picker"
            />
            <div 
              className="w-full h-full"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

AppearanceControls.displayName = 'AppearanceControls';
