/**
 * Setup collection service for gathering IDE configuration
 */

import * as vscode from 'vscode';
import { UserSetup, ExtensionInfo, EditorSettings } from '../types';
import { logger } from '../utils/logger';
import { getEditorName as detectEditorName } from '../utils/ide-detector';

/** Default values for editor configuration */
const DEFAULTS = {
  THEME: 'Default Dark+',
  FONT_FAMILY: 'Consolas, Monaco, monospace',
  FONT_SIZE: 14,
} as const;

/** Settings keys to collect from IDE configuration */
const SETTINGS_KEYS = [
  // Editor settings
  'editor.tabSize',
  'editor.wordWrap',
  'editor.minimap.enabled',
  'editor.formatOnSave',
  'editor.lineHeight',
  'editor.fontLigatures',
  'editor.cursorStyle',
  'editor.cursorBlinking',
  'editor.renderWhitespace',
  'editor.rulers',
  // Workbench settings
  'workbench.iconTheme',
  'workbench.sideBar.location',
  'workbench.activityBar.location',
  // Files settings
  'files.autoSave',
  'files.trimTrailingWhitespace',
  'files.insertFinalNewline',
  // Terminal settings
  'terminal.integrated.fontSize',
  'terminal.integrated.fontFamily',
  'terminal.integrated.cursorStyle',
] as const;

/**
 * Service for collecting user's IDE setup configuration
 */
export class SetupService {
  /**
   * Get normalized editor name for API identification
   */
  getEditorName(): string {
    return detectEditorName();
  }

  /**
   * Collect complete setup data from IDE environment
   *
   * @param name - User-defined name for the setup
   * @param description - Optional description of the setup
   * @param isPublic - Whether the setup should be publicly visible
   * @returns The complete UserSetup object
   */
  async collectSetup(name: string, description?: string, isPublic = true): Promise<UserSetup> {
    logger.info('Collecting setup data...');

    const config = vscode.workspace.getConfiguration();

    const setup: UserSetup = {
      name,
      description,
      editorName: this.getEditorName(),
      theme: this.getTheme(config),
      fontFamily: this.getFontFamily(config),
      fontSize: this.getFontSize(config),
      extensions: this.getExtensions(),
      settings: this.getSettings(config),
      isPublic,
    };

    logger.info(
      `Setup collected: ${setup.extensions.length} extensions, ${Object.keys(setup.settings).length} settings`
    );
    return setup;
  }

  /**
   * Get current color theme
   */
  private getTheme(config: vscode.WorkspaceConfiguration): string {
    return config.get<string>('workbench.colorTheme') || DEFAULTS.THEME;
  }

  /**
   * Get editor font family
   */
  private getFontFamily(config: vscode.WorkspaceConfiguration): string {
    return config.get<string>('editor.fontFamily') || DEFAULTS.FONT_FAMILY;
  }

  /**
   * Get editor font size
   */
  private getFontSize(config: vscode.WorkspaceConfiguration): number {
    return config.get<number>('editor.fontSize') || DEFAULTS.FONT_SIZE;
  }

  /**
   * Get installed extensions (excluding built-in)
   */
  private getExtensions(): ExtensionInfo[] {
    const extensions = vscode.extensions.all
      .filter((ext) => !ext.packageJSON.isBuiltin)
      .map((ext) => ({
        name: ext.packageJSON.displayName || ext.packageJSON.name,
        id: ext.id,
        version: ext.packageJSON.version,
        publisher: ext.packageJSON.publisher,
        description: ext.packageJSON.description,
      }));

    logger.debug(`Found ${extensions.length} user-installed extensions`);
    return extensions;
  }

  /**
   * Get important editor and workbench settings
   */
  private getSettings(config: vscode.WorkspaceConfiguration): EditorSettings {
    const settings: Record<string, unknown> = {};

    for (const key of SETTINGS_KEYS) {
      const value = config.get(key);
      if (value !== undefined && value !== null) {
        settings[key] = value;
      }
    }

    return settings as EditorSettings;
  }
}
