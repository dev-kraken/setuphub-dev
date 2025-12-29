/**
 * Sync command handler
 */

import { StorageService } from '../services/storage.service';
import { SetupService } from '../services/setup.service';
import { ApiService } from '../services/api.service';
import { VisibilityOption } from '../types';
import {
  showError,
  showSuccess,
  showInfo,
  showInputBox,
  showQuickPick,
  withProgress,
  openUrl,
  copyToClipboard,
} from '../ui/notifications';
import { validateSetupName, validateDescription, sanitizeInput } from '../utils/validators';
import { getUserFriendlyError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { Commands, ProgressMessages } from '../config/constants';
import * as vscode from 'vscode';

/**
 * Handle sync setup command
 */
export async function handleSyncSetup(
  storageService: StorageService,
  setupService: SetupService,
  apiService: ApiService
): Promise<void> {
  try {
    logger.info('Starting sync setup flow...');

    // Check authentication
    if (!storageService.isAuthenticated()) {
      const action = await showInfo('Please login to sync your setup', 'Login');

      if (action === 'Login') {
        await vscode.commands.executeCommand(Commands.LOGIN);
      }
      return;
    }

    // Get token and check for existing setup
    const token = storageService.getAuthToken()!;
    const editorName = setupService.getEditorName();
    const existingSetup = await apiService.getExistingSetup(token, editorName);

    // Collect setup metadata from user (with pre-filled values if updating)
    const metadata = await collectSetupMetadata(existingSetup);
    if (!metadata) {
      logger.info('Sync cancelled by user');
      return;
    }

    // Perform sync with progress
    const actionVerb = existingSetup ? 'Updating' : 'Syncing';
    const response = await withProgress(`${actionVerb} your setup...`, async (progress) => {
      // Collect setup data
      progress.report({ increment: 30, message: ProgressMessages.COLLECTING });
      const setup = await setupService.collectSetup(
        metadata.name,
        metadata.description,
        metadata.isPublic
      );

      // Upload to server
      progress.report({ increment: 40, message: ProgressMessages.UPLOADING });
      const response = await apiService.syncSetup(setup, token);

      // Finalize
      progress.report({ increment: 30, message: ProgressMessages.FINALIZING });
      return response;
    });

    // Show success after progress closes
    await handleSyncSuccess(response.shareUrl, !!existingSetup);

    logger.info('Setup synced successfully');
  } catch (error) {
    const message = getUserFriendlyError(error);
    await showError(`Failed to sync: ${message}`);
    logger.error('Sync failed', error);
  }
}

/**
 * Collect setup metadata from user
 */
async function collectSetupMetadata(
  existingSetup?: { name: string; description?: string } | null
): Promise<{
  name: string;
  description?: string;
  isPublic: boolean;
} | null> {
  const isUpdate = !!existingSetup;

  // Get setup name
  const name = await showInputBox({
    prompt: isUpdate ? 'Update your setup name' : 'Give your setup a name',
    placeHolder: 'My Awesome Setup',
    value: existingSetup?.name || 'My Setup',
    validateInput: (value) => {
      try {
        validateSetupName(value);
        return null;
      } catch (error) {
        if (error instanceof ValidationError) {
          return error.message;
        }
        return 'Invalid name';
      }
    },
  });

  if (!name) {
    return null;
  }

  // Get description
  const description = await showInputBox({
    prompt: isUpdate ? 'Update your setup description (optional)' : 'Add a description (optional)',
    placeHolder: 'Describe your setup, what makes it special?',
    value: existingSetup?.description || '',
    validateInput: (value) => {
      try {
        validateDescription(value);
        return null;
      } catch (error) {
        if (error instanceof ValidationError) {
          return error.message;
        }
        return 'Invalid description';
      }
    },
  });

  // Tags removed - no longer needed

  // Get visibility
  const visibilityOptions: VisibilityOption[] = [
    {
      label: 'Public',
      value: true,
      description: 'Anyone can see your setup',
    },
    {
      label: 'Private',
      value: false,
      description: 'Only you can see your setup',
    },
  ];

  const visibility = await showQuickPick(visibilityOptions, {
    placeHolder: 'Choose visibility',
  });

  if (!visibility) {
    return null;
  }

  return {
    name: sanitizeInput(name),
    description: description ? sanitizeInput(description) : undefined,
    isPublic: visibility.value,
  };
}

/**
 * Handle successful sync
 */
async function handleSyncSuccess(shareUrl: string, isUpdate: boolean): Promise<void> {
  const message = isUpdate ? 'Setup updated successfully! 🎉' : 'Setup synced successfully! 🎉';
  const action = await showSuccess(message, 'Open in Browser', 'Copy Link');

  if (action === 'Open in Browser') {
    await openUrl(shareUrl);
  } else if (action === 'Copy Link') {
    await copyToClipboard(shareUrl, 'Link copied to clipboard!');
  }
}
