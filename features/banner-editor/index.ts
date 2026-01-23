// Components
export {
  AppearanceControls,
  BannerEditorErrorBoundary,
  BannerPreview,
  ContentControls,
  ControlSection,
  ExportButton,
  IconographyControls,
  TypographyControls,
} from './components';

// Hooks
export { useDebouncedValue } from './hooks/use-debounced-value';

// Types
export type {
  AppearanceControlsProps,
  BannerConfig,
  BannerPreviewProps,
  ContentControlsProps,
  ControlSectionProps,
  ExportButtonProps,
  FontFamily,
  IconographyControlsProps,
  Theme,
  TypographyControlsProps,
} from './types';
export { FONT_FAMILY, THEME } from './types';

// Constants
export {
  BACKGROUND_TEXTURE_OPACITY,
  BORDER_OPACITY,
  DEBOUNCE_DELAY_MS,
  DEFAULT_CONFIG,
  DEFAULT_PIXEL_RATIO,
  FONT_DEFINITIONS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FOOTER_MAX_LENGTH,
  ICON_MAP,
  ICON_SIZE,
  isPresetFont,
  isValidIconName,
  PRESET_COLORS,
  PRESET_FONTS,
  RADIAL_GLOW_OPACITY,
  TITLE_MAX_LENGTH,
} from './lib/constants';
export type { IconName, PresetFont } from './lib/constants';

// Utils
export {
  hexToRgba,
  isValidHexColor,
  normalizeHexColor,
  parseFooterText,
  sanitizeFilename,
  sanitizeInput,
  shadeColor,
} from './lib/utils';
export type { ParsedFooter } from './lib/utils';

// Pages
export { BannerEditorPage } from './pages/banner-editor-page';
