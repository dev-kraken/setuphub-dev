'use client';

import { memo, useCallback } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FOOTER_MAX_LENGTH, TITLE_MAX_LENGTH } from '../lib/constants';
import { sanitizeInput, trimInput } from '../lib/utils';
import type { ContentControlsProps } from '../types';

export const ContentControls = memo(function ContentControls({
  title,
  footerLeft,
  footerRight,
  onTitleChange,
  onFooterLeftChange,
  onFooterRightChange,
}: ContentControlsProps) {
  // Change handlers - only limit length, don't trim (avoids cursor jump)
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onTitleChange(sanitizeInput(e.target.value, TITLE_MAX_LENGTH));
    },
    [onTitleChange]
  );

  const handleFooterLeftChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFooterLeftChange(sanitizeInput(e.target.value, FOOTER_MAX_LENGTH));
    },
    [onFooterLeftChange]
  );

  const handleFooterRightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFooterRightChange(sanitizeInput(e.target.value, FOOTER_MAX_LENGTH));
    },
    [onFooterRightChange]
  );

  // Blur handlers - trim whitespace on blur
  const handleTitleBlur = useCallback(() => {
    const trimmed = trimInput(title);
    if (trimmed !== title) {
      onTitleChange(trimmed);
    }
  }, [title, onTitleChange]);

  const handleFooterLeftBlur = useCallback(() => {
    const trimmed = trimInput(footerLeft);
    if (trimmed !== footerLeft) {
      onFooterLeftChange(trimmed);
    }
  }, [footerLeft, onFooterLeftChange]);

  const handleFooterRightBlur = useCallback(() => {
    const trimmed = trimInput(footerRight);
    if (trimmed !== footerRight) {
      onFooterRightChange(trimmed);
    }
  }, [footerRight, onFooterRightChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="title-input" className="text-sm font-semibold text-neutral-400 font-oxanium">
            Title
          </Label>
          <span className="text-xs text-neutral-500 font-mono">
            {title.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>
        <Input
          id="title-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          className="w-full px-4 py-6 rounded-xl bg-black/20 border border-white/5 text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20 outline-none transition-all placeholder:text-neutral-600 text-lg"
          placeholder="Banner Title"
          maxLength={TITLE_MAX_LENGTH}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="footer-left-input"
              className="text-sm font-medium text-neutral-400 font-oxanium"
            >
              Footer Left
            </Label>
            <span className="text-[10px] text-neutral-500 font-mono">
              {footerLeft.length}/{FOOTER_MAX_LENGTH}
            </span>
          </div>
          <Input
            id="footer-left-input"
            type="text"
            value={footerLeft}
            onChange={handleFooterLeftChange}
            onBlur={handleFooterLeftBlur}
            className="w-full px-4 py-5 rounded-xl bg-black/20 border border-white/5 text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20 outline-none transition-all placeholder:text-neutral-600 text-sm font-mono"
            placeholder=">_ command"
            maxLength={FOOTER_MAX_LENGTH}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="footer-right-input"
              className="text-sm font-medium text-neutral-400 font-oxanium"
            >
              Footer Right
            </Label>
            <span className="text-[10px] text-neutral-500 font-mono">
              {footerRight.length}/{FOOTER_MAX_LENGTH}
            </span>
          </div>
          <Input
            id="footer-right-input"
            type="text"
            value={footerRight}
            onChange={handleFooterRightChange}
            onBlur={handleFooterRightBlur}
            className="w-full px-4 py-5 rounded-xl bg-black/20 border border-white/5 text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20 outline-none transition-all placeholder:text-neutral-600 text-sm font-mono"
            placeholder="#hashtag"
            maxLength={FOOTER_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
});

ContentControls.displayName = 'ContentControls';
