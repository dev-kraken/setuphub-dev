/**
 * Storage service for managing IDE extension global state
 */

import * as vscode from 'vscode';
import { StorageKeys } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Type-safe storage service wrapping the IDE's globalState
 * Handles persistence of authentication and user data
 */
export class StorageService {
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Get stored authentication token
   */
  getAuthToken(): string | undefined {
    return this.context.globalState.get<string>(StorageKeys.AUTH_TOKEN);
  }

  /**
   * Store authentication token
   */
  async setAuthToken(token: string): Promise<void> {
    await this.context.globalState.update(StorageKeys.AUTH_TOKEN, token);
    logger.debug('Auth token saved');
  }

  /**
   * Get stored username
   */
  getUsername(): string | undefined {
    return this.context.globalState.get<string>(StorageKeys.USERNAME);
  }

  /**
   * Store username
   */
  async setUsername(username: string): Promise<void> {
    await this.context.globalState.update(StorageKeys.USERNAME, username);
    logger.debug(`Username saved: ${username}`);
  }

  /**
   * Get stored display name
   */
  getDisplayName(): string | undefined {
    return this.context.globalState.get<string>(StorageKeys.DISPLAY_NAME);
  }

  /**
   * Store display name
   */
  async setDisplayName(name: string): Promise<void> {
    await this.context.globalState.update(StorageKeys.DISPLAY_NAME, name);
    logger.debug(`Display name saved: ${name}`);
  }

  /**
   * Check if this is the first time the extension is installed
   */
  isFirstInstall(): boolean {
    return !this.context.globalState.get<boolean>(StorageKeys.FIRST_INSTALL);
  }

  /**
   * Mark first install welcome flow as complete
   */
  async markFirstInstallComplete(): Promise<void> {
    await this.context.globalState.update(StorageKeys.FIRST_INSTALL, true);
    logger.debug('First install marked as complete');
  }

  /**
   * Check if user is authenticated (has both token and username)
   */
  isAuthenticated(): boolean {
    return !!(this.getAuthToken() && this.getUsername());
  }

  /**
   * Clear all authentication data (logout)
   */
  async clearAuth(): Promise<void> {
    await Promise.all([
      this.context.globalState.update(StorageKeys.AUTH_TOKEN, undefined),
      this.context.globalState.update(StorageKeys.USERNAME, undefined),
      this.context.globalState.update(StorageKeys.DISPLAY_NAME, undefined),
    ]);
    logger.info('Authentication data cleared');
  }
}
