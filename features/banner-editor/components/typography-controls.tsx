'use client';

import dynamic from 'next/dynamic';
import { memo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

import { FONT_DEFINITIONS, FONT_SIZE_MAX, FONT_SIZE_MIN, isPresetFont, PRESET_FONTS } from '../lib/constants';
import type { TypographyControlsProps } from '../types';

// Lazy load FontPicker since it loads Google Fonts API data
const FontPicker = dynamic(() => import('./font-picker').then((mod) => ({ default: mod.FontPicker })), {
  loading: () => <div className="h-10 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />,
  ssr: false,
});

export const TypographyControls = memo(function TypographyControls({
  selectedFont,
  titleFontSize,
  onFontChange,
  onFontSizeChange,
}: TypographyControlsProps) {
  const handleSliderChange = useCallback(
    (value: number[]) => {
      onFontSizeChange(value[0]);
    },
    [onFontSizeChange],
  );

  const handleFontPickerChange = useCallback(
    (fontFamily: string) => {
      onFontChange(fontFamily);
    },
    [onFontChange],
  );

  // Check if current font is a preset
  const isCurrentFontPreset = isPresetFont(selectedFont);

  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <Label id="font-family-label" className="text-sm font-medium text-neutral-400 font-oxanium">
            Font Family
          </Label>
          <span id="font-size-value" className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-neutral-400">
            {titleFontSize}px
          </span>
        </div>

        {/* Preset Fonts */}
        <div
          className="grid w-full grid-cols-2 gap-2 md:grid-cols-3"
          role="radiogroup"
          aria-labelledby="font-family-label"
        >
          {PRESET_FONTS.map((fontKey) => (
            <Button
              key={fontKey}
              variant="ghost"
              onClick={() => onFontChange(fontKey)}
              className={cn(
                'min-h-[44px] w-full truncate rounded-lg border px-3 py-3 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none',
                selectedFont === fontKey
                  ? 'border-white/20 bg-neutral-100/10 text-white'
                  : 'border-transparent bg-black/20 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300',
              )}
              style={{ fontFamily: FONT_DEFINITIONS[fontKey] || fontKey }}
              role="radio"
              aria-checked={selectedFont === fontKey}
              aria-label={`Select ${fontKey} font`}
            >
              {fontKey}
            </Button>
          ))}
        </div>

        {/* Google Fonts Picker */}
        <div className="mt-4 w-full space-y-2">
          <Label className="block text-sm font-medium text-neutral-400 font-oxanium">Or choose from Google Fonts</Label>
          <FontPicker
            value={isCurrentFontPreset ? undefined : selectedFont}
            onChange={handleFontPickerChange}
            showFilters={false}
            className="w-full"
          />
        </div>

        {/* Font Size Slider */}
        <div className="mt-4 w-full space-y-3">
          <Label id="font-size-label" className="block text-sm font-medium text-neutral-400 font-oxanium">
            Font Size
          </Label>
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3">
            <span className="text-xs font-medium text-neutral-500" aria-hidden="true">
              Aa
            </span>
            <Slider
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={1}
              value={[titleFontSize]}
              onValueChange={handleSliderChange}
              className="flex-1 cursor-pointer py-2"
              aria-label="Font size"
              aria-describedby="font-size-value"
            />
            <span className="text-xl font-medium text-white" aria-hidden="true">
              Aa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

TypographyControls.displayName = 'TypographyControls';
