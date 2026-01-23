'use client';

import { memo, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { BORDER_OPACITY, getFontFamily, ICON_MAP, ICON_SIZE, isPresetFont, isValidIconName } from '../lib/constants';
import { loadFont } from '../lib/fonts';
import { hexToRgba, parseFooterText, shadeColor } from '../lib/utils';
import { type BannerPreviewProps, THEME } from '../types';

export const BannerPreview = memo(function BannerPreview({
  theme,
  accentColor,
  selectedIcon,
  selectedFont,
  titleFontSize,
  title,
  footerLeft,
  footerRight,
  previewRef,
}: BannerPreviewProps) {
  const IconComponent = isValidIconName(selectedIcon) ? ICON_MAP[selectedIcon] : ICON_MAP.Activity;
  const fontFamily = getFontFamily(selectedFont);
  const isGoogleFont = !isPresetFont(selectedFont);
  const parsedFooter = parseFooterText(footerLeft);

  // Load Google Font if needed
  useEffect(() => {
    if (isGoogleFont && selectedFont) {
      loadFont(selectedFont).then((result) => {
        if (!result.success) {
          console.error('Failed to load font:', result.error);
        }
      });
    }
  }, [isGoogleFont, selectedFont]);

  return (
    <div
      ref={previewRef}
      className="relative flex aspect-3/1 w-full flex-col overflow-hidden rounded-3xl shadow-2xl"
      style={{
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: hexToRgba(accentColor, BORDER_OPACITY),
        backgroundColor: theme === THEME.LIGHT ? '#ffffff' : '#050505',
      }}
      role="img"
      aria-label="Banner preview"
    >
      <div className="relative flex h-full w-full flex-col">
        {/* Background texture */}
        <div className="pointer-events-none absolute h-full w-full bg-repeat opacity-[0.03]" />

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-[-65%] right-0 left-0 h-full opacity-65 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${accentColor}, transparent 65%)`,
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-1 items-center justify-center gap-6 px-12">
          <div
            className="flex shrink-0 items-center justify-center rounded-3xl p-5 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${shadeColor(accentColor, -50)})`,
            }}
          >
            <IconComponent size={ICON_SIZE} className="text-white drop-shadow-sm" stroke={2} aria-hidden="true" />
          </div>

          <h1
            className={cn(
              'w-auto text-center font-normal tracking-wide wrap-break-word transition-colors duration-300',
              theme === THEME.LIGHT ? 'text-neutral-900' : 'text-neutral-100',
            )}
            style={{
              fontFamily,
              fontSize: `${titleFontSize}px`,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'relative z-10 flex h-16 w-full items-center justify-between border-t px-8 backdrop-blur-sm transition-colors duration-300',
            theme === THEME.LIGHT ? 'border-black/5 bg-white/40' : 'border-white/10 bg-black/40',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 text-lg',
              theme === THEME.LIGHT ? 'text-neutral-600' : 'text-neutral-400',
            )}
            style={{ fontFamily }}
          >
            <span style={{ color: accentColor }}>{parsedFooter.highlight}</span>
            {parsedFooter.rest && <span>{parsedFooter.rest}</span>}
          </div>

          <div
            className="text-lg text-neutral-500 opacity-80"
            style={{ fontFamily }}
          >
            {footerRight}
          </div>
        </div>
      </div>
    </div>
  );
});

BannerPreview.displayName = 'BannerPreview';
