/**
 * Types related to IDE setup configuration and data collection
 */

/**
 * Represents an installed IDE extension
 */
export interface ExtensionInfo {
  /** Display name of the extension */
  name: string;
  /** Unique extension identifier (publisher.name) */
  id: string;
  /** Current version of the extension */
  version: string;
  /** Publisher/author of the extension */
  publisher?: string;
  /** Brief description of the extension */
  description?: string;
}

/**
 * IDE editor and workbench settings
 */
export interface EditorSettings {
  // Editor settings
  'editor.tabSize'?: number;
  'editor.wordWrap'?: string;
  'editor.minimap.enabled'?: boolean;
  'editor.formatOnSave'?: boolean;
  'editor.lineHeight'?: number;
  'editor.fontLigatures'?: boolean | string;
  'editor.cursorStyle'?: string;
  'editor.cursorBlinking'?: string;
  'editor.renderWhitespace'?: string;
  'editor.rulers'?: number[];

  // Workbench settings
  'workbench.iconTheme'?: string;
  'workbench.sideBar.location'?: string;
  'workbench.activityBar.location'?: string;

  // Files settings
  'files.autoSave'?: string;
  'files.trimTrailingWhitespace'?: boolean;
  'files.insertFinalNewline'?: boolean;

  // Terminal settings
  'terminal.integrated.fontSize'?: number;
  'terminal.integrated.fontFamily'?: string;
  'terminal.integrated.cursorStyle'?: string;

  // Allow for additional settings
  [key: string]: unknown;
}

/**
 * Complete user setup configuration
 */
export interface UserSetup {
  /** User-defined name for this setup */
  name: string;
  /** Optional description of the setup */
  description?: string;
  /** IDE/Editor name (vscode, cursor, antigravity, etc.) */
  editorName: string;
  /** Current color theme */
  theme: string;
  /** Editor font family */
  fontFamily: string;
  /** Editor font size */
  fontSize: number;
  /** List of installed extensions */
  extensions: ExtensionInfo[];
  /** IDE settings/preferences */
  settings: EditorSettings;
  /** Whether this setup is publicly visible */
  isPublic: boolean;
}

/**
 * Visibility option for setup sharing
 */
export interface VisibilityOption {
  /** Display label */
  label: string;
  /** Boolean value for public/private */
  value: boolean;
  /** Description of this option */
  description: string;
}
