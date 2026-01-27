// Banner Editor Types

export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
  } as const;
  
  export type Theme = (typeof THEME)[keyof typeof THEME];
  
  export const FONT_FAMILY = {
    SANS: 'Sans',
    MONO: 'Mono',
    SERIF: 'Serif',
    IMPACT: 'Impact',
    SYSTEM: 'System',
  } as const;
  
  export type FontFamily = (typeof FONT_FAMILY)[keyof typeof FONT_FAMILY];
  
  export interface BannerConfig {
    theme: Theme;
    accentColor: string;
    selectedIcon: string;
    selectedFont: string; // Can be FontFamily preset or Google Font name
    titleFontSize: number;
    title: string;
    footerLeft: string;
    footerRight: string;
  }
  
  export interface BannerPreviewProps extends BannerConfig {
    previewRef: React.RefObject<HTMLDivElement | null>;
  }
  
  export interface ControlSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }
  
  export interface AppearanceControlsProps {
    theme: Theme;
    accentColor: string;
    onThemeChange: (theme: Theme) => void;
    onAccentColorChange: (color: string) => void;
  }
  
  export interface TypographyControlsProps {
    selectedFont: string;
    titleFontSize: number;
    onFontChange: (font: string) => void;
    onFontSizeChange: (size: number) => void;
  }
  
  export interface IconographyControlsProps {
    selectedIcon: string;
    onIconChange: (icon: string) => void;
  }
  
  export interface ContentControlsProps {
    title: string;
    footerLeft: string;
    footerRight: string;
    onTitleChange: (value: string) => void;
    onFooterLeftChange: (value: string) => void;
    onFooterRightChange: (value: string) => void;
  }
  
  export interface ExportButtonProps {
    isExporting: boolean;
    error: string | null;
    onExport: () => void;
  }
  