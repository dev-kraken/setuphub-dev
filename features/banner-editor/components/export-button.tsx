'use client';

import { IconDownload, IconLoader2 } from '@tabler/icons-react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';

import type { ExportButtonProps } from '../types';

export const ExportButton = memo(function ExportButton({
  isExporting,
  error,
  onExport,
}: ExportButtonProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={onExport}
        disabled={isExporting}
        className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
        aria-label="Download banner as SVG"
      >
        {isExporting ? (
          <>
            <IconLoader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <IconDownload className="h-4 w-4" />
            Download SVG
          </>
        )}
      </Button>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
});

ExportButton.displayName = 'ExportButton';
