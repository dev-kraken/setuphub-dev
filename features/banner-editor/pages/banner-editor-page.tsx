'use client';

import { IconSettings } from '@tabler/icons-react';
import { toSvg } from 'html-to-image';
import { motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';

import { AppearanceControls } from '../components/appearance-controls';
import { BannerEditorErrorBoundary } from '../components/error-boundary';
import { BannerPreview } from '../components/banner-preview';
import { ContentControls } from '../components/content-controls';
import { ControlSection } from '../components/control-section';
import { ExportButton } from '../components/export-button';
import { IconographyControls } from '../components/iconography-controls';
import { TypographyControls } from '../components/typography-controls';
import { DEFAULT_CONFIG } from '../lib/constants';
import { sanitizeFilename } from '../lib/utils';
import type { BannerConfig, Theme } from '../types';

function BannerEditor() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const debouncedTitle = useDebouncedValue(config.title);
  const debouncedFooterLeft = useDebouncedValue(config.footerLeft);
  const debouncedFooterRight = useDebouncedValue(config.footerRight);

  const updateConfig = useCallback(<K extends keyof BannerConfig>(key: K, value: BannerConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setExportError(null);
  }, []);

  const handleThemeChange = useCallback((theme: Theme) => updateConfig('theme', theme), [updateConfig]);
  const handleAccentColorChange = useCallback((color: string) => updateConfig('accentColor', color), [updateConfig]);
  const handleFontChange = useCallback((font: string) => updateConfig('selectedFont', font), [updateConfig]);
  const handleFontSizeChange = useCallback((size: number) => updateConfig('titleFontSize', size), [updateConfig]);
  const handleIconChange = useCallback((icon: string) => updateConfig('selectedIcon', icon), [updateConfig]);
  const handleTitleChange = useCallback((value: string) => updateConfig('title', value), [updateConfig]);
  const handleFooterLeftChange = useCallback((value: string) => updateConfig('footerLeft', value), [updateConfig]);
  const handleFooterRightChange = useCallback((value: string) => updateConfig('footerRight', value), [updateConfig]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current) {
      setExportError('Preview not ready');
      toast.error('Preview not ready');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const dataUrl = await toSvg(previewRef.current, {
        cacheBust: true,
        quality: 1,
        includeQueryParams: true,
        skipFonts: false,
        filter: (node) => !(node instanceof HTMLElement && node.tagName === 'LINK'),
      });

      const link = document.createElement('a');
      link.download = `${sanitizeFilename(config.title)}-banner.svg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      const message = 'Failed to export banner. Please try again.';
      setExportError(message);
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  }, [config.title]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-12 p-8 font-sans text-neutral-100">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/80 shadow-xl backdrop-blur-xl lg:col-span-4"
        >
          <ScrollArea className="flex h-fit max-h-[calc(100vh-20rem)] w-full flex-col gap-6 p-4">
            <div>
              <h2 className="font-oxanium mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <IconSettings className="size-5 text-neutral-400" />
                Editor Controls
              </h2>

              <ControlSection title="Appearance" defaultOpen>
                <AppearanceControls
                  theme={config.theme}
                  accentColor={config.accentColor}
                  onThemeChange={handleThemeChange}
                  onAccentColorChange={handleAccentColorChange}
                />
              </ControlSection>

              <ControlSection title="Typography">
                <TypographyControls
                  selectedFont={config.selectedFont}
                  titleFontSize={config.titleFontSize}
                  onFontChange={handleFontChange}
                  onFontSizeChange={handleFontSizeChange}
                />
              </ControlSection>

              <ControlSection title="Iconography">
                <IconographyControls selectedIcon={config.selectedIcon} onIconChange={handleIconChange} />
              </ControlSection>

              <ControlSection title="Content" defaultOpen>
                <ContentControls
                  title={config.title}
                  footerLeft={config.footerLeft}
                  footerRight={config.footerRight}
                  onTitleChange={handleTitleChange}
                  onFooterLeftChange={handleFooterLeftChange}
                  onFooterRightChange={handleFooterRightChange}
                />
              </ControlSection>
            </div>
          </ScrollArea>
        </motion.div>

        {/* Preview Panel */}
        <div className="flex flex-col items-center lg:col-span-8">
          <div className="mb-6 flex w-full items-end justify-between">
            <h2 className="font-oxanium text-3xl font-semibold text-white">Preview</h2>
            <ExportButton isExporting={isExporting} error={exportError} onExport={handleExport} />
          </div>

          <BannerPreview
            {...config}
            title={debouncedTitle}
            footerLeft={debouncedFooterLeft}
            footerRight={debouncedFooterRight}
            previewRef={previewRef}
          />
        </div>
      </div>
    </div>
  );
}

export function BannerEditorPage() {
  return (
    <BannerEditorErrorBoundary>
      <BannerEditor />
    </BannerEditorErrorBoundary>
  );
}

BannerEditorPage.displayName = 'BannerEditorPage';
