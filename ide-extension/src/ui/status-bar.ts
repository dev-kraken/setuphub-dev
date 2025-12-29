/**
 * Status bar management
 */

import * as vscode from 'vscode';
import { Commands } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Manages the extension's status bar item
 */
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = Commands.PROFILE;
    logger.debug('Status bar item created');
  }

  /**
   * Update status bar to show logged-in user
   */
  updateForUser(username: string): void {
    this.statusBarItem.text = `$(account) ${username}`;
    this.statusBarItem.tooltip = 'Click to view your SetupHub profile';
    this.statusBarItem.show();
    logger.debug(`Status bar updated for user: ${username}`);
  }

  /**
   * Update status bar for logged-out state
   */
  updateForLoggedOut(): void {
    this.statusBarItem.hide();
    logger.debug('Status bar hidden (logged out)');
  }

  /**
   * Dispose of the status bar item
   */
  dispose(): void {
    this.statusBarItem.dispose();
    logger.debug('Status bar item disposed');
  }

  /**
   * Get the disposable for registration
   */
  getDisposable(): vscode.Disposable {
    return this.statusBarItem;
  }
}
