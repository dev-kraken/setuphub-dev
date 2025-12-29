/**
 * User notification and UI interaction helpers
 */

import * as vscode from 'vscode';
import { logger } from '../utils/logger';

/**
 * Show a success notification (green checkmark style)
 */
export async function showSuccess(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  logger.info(`Success: ${message}`);
  return vscode.window.showInformationMessage(message, ...actions);
}

/**
 * Show an error notification (red error style)
 */
export async function showError(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  logger.error(`Error shown to user: ${message}`);
  return vscode.window.showErrorMessage(message, ...actions);
}

/**
 * Show a warning notification (yellow warning style)
 */
export async function showWarning(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  logger.warn(`Warning: ${message}`);
  return vscode.window.showWarningMessage(message, ...actions);
}

/**
 * Show an informational notification
 */
export async function showInfo(message: string, ...actions: string[]): Promise<string | undefined> {
  logger.info(`Info: ${message}`);
  return vscode.window.showInformationMessage(message, ...actions);
}

/**
 * Show an input box for user text input
 */
export async function showInputBox(options: vscode.InputBoxOptions): Promise<string | undefined> {
  return vscode.window.showInputBox(options);
}

/**
 * Show a quick pick selection dialog
 */
export async function showQuickPick<T extends vscode.QuickPickItem>(
  items: T[],
  options: vscode.QuickPickOptions
): Promise<T | undefined> {
  return vscode.window.showQuickPick(items, options);
}

/**
 * Progress callback type for withProgress
 */
type ProgressCallback<T> = (
  progress: vscode.Progress<{ message?: string; increment?: number }>
) => Promise<T>;

/**
 * Show a progress notification while executing a task
 */
export async function withProgress<T>(title: string, task: ProgressCallback<T>): Promise<T> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title,
      cancellable: false,
    },
    task
  );
}

/**
 * Copy text to clipboard with optional success message
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<void> {
  await vscode.env.clipboard.writeText(text);
  if (successMessage) {
    await showSuccess(successMessage);
  }
  logger.debug('Text copied to clipboard');
}

/**
 * Open a URL in the default browser
 *
 * @returns True if the URL was opened successfully
 */
export async function openUrl(url: string): Promise<boolean> {
  try {
    const uri = vscode.Uri.parse(url);
    const opened = await vscode.env.openExternal(uri);
    logger.debug(`Opened URL: ${url}, success: ${opened}`);
    return opened;
  } catch (error) {
    logger.error(`Failed to open URL: ${url}`, error);
    return false;
  }
}
