/**
 * Profile and browse command handlers
 */

import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { showInfo, openUrl } from '../ui/notifications';
import { logger } from '../utils/logger';
import { Commands } from '../config/constants';
import * as vscode from 'vscode';

/**
 * Handle view profile command
 */
export async function handleViewProfile(
  storageService: StorageService,
  apiService: ApiService
): Promise<void> {
  logger.info('Viewing user profile...');

  const username = storageService.getUsername();

  if (!username) {
    const action = await showInfo('Please login first', 'Login');
    if (action === 'Login') {
      await vscode.commands.executeCommand(Commands.LOGIN);
    }
    return;
  }

  const profileUrl = apiService.getProfileUrl(username);
  await openUrl(profileUrl);
  logger.info(`Opened profile for user: ${username}`);
}

/**
 * Handle browse community setups command
 */
export async function handleBrowseSetups(apiService: ApiService): Promise<void> {
  logger.info('Opening community setups...');
  const setupsUrl = apiService.getSetupsUrl();
  await openUrl(setupsUrl);
}
