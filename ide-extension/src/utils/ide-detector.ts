/**
 * IDE detection utility
 * Detects which IDE/editor is being used (VS Code, Cursor, Antigravity, Windsurf, etc.)
 */

import * as vscode from 'vscode';
import { logger } from './logger';

/**
 * Map of known IDE names to their normalized identifiers
 */
const IDE_NAME_MAP: Record<string, string> = {
  'VS Code': 'vscode',
  'Visual Studio Code': 'vscode',
  Cursor: 'cursor',
  Antigravity: 'antigravity',
  Windsurf: 'windsurf',
  VSCodium: 'vscodium',
  'Code - OSS': 'vscode-oss',
} as const;

/**
 * Get the normalized editor name for API identification
 *
 * @returns Normalized IDE name (e.g., 'vscode', 'cursor', 'antigravity', 'windsurf')
 */
export function getEditorName(): string {
  try {
    const appName = vscode.env.appName;
    logger.debug(`Detected raw app name: ${appName}`);

    // Check if we have a direct mapping for this IDE
    const normalizedName = IDE_NAME_MAP[appName];

    if (normalizedName) {
      logger.info(`Detected IDE: ${normalizedName}`);
      return normalizedName;
    }

    // For unknown IDEs, create a normalized identifier
    const fallbackName = appName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    logger.warn(`Unknown IDE detected: ${appName}, using fallback: ${fallbackName}`);
    return fallbackName || 'vscode';
  } catch (error) {
    logger.error('Failed to detect IDE name', error);
    return 'vscode';
  }
}
