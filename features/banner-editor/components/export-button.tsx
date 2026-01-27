'use client';

import { IconAlertCircle, IconDownload, IconLoader2 } from '@tabler/icons-react';
import { memo } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
        variant="default"
        className="px-6 py-2 text-sm font-medium text-black bg-white hover:bg-neutral-200 cursor-pointer"
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
        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
});

ExportButton.displayName = 'ExportButton';
