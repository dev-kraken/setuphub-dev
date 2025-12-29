/**
 * Authentication command handlers (login and logout)
 */

import * as vscode from 'vscode';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { showError, showInfo, showInputBox, showSuccess, showWarning } from '../ui/notifications';
import { StatusBarManager } from '../ui/status-bar';
import { Commands } from '../config/constants';
import { getUserFriendlyError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Handle login command
 */
export async function handleLogin(
  storageService: StorageService,
  authService: AuthService,
  apiService: ApiService,
  statusBar: StatusBarManager
): Promise<void> {
  try {
    logger.info('Starting login flow...');

    // Check if user is already logged in
    if (storageService.isAuthenticated()) {
      const username = storageService.getUsername()!;
      const displayName = storageService.getDisplayName() || username;

      const action = await showInfo(
        `You're already logged in as ${displayName}`,
        'Logout',
        'Cancel'
      );

      if (action === 'Logout') {
        await vscode.commands.executeCommand(Commands.LOGOUT);
      }

      logger.info('Login command cancelled - user already authenticated');
      return;
    }

    // Get the auth URL from the website
    const authUrl = apiService.getAuthUrl();
    logger.info(`Opening auth URL: ${authUrl}`);

    // Open auth page in browser immediately
    logger.info('Attempting to open browser...');
    const uri = vscode.Uri.parse(authUrl);
    await vscode.env.openExternal(uri);
    logger.info('Browser open command sent');

    // Show instructions after opening browser
    const proceed = await showInfo(
      `Opening browser to: ${authUrl}\n\nAfter signing in, copy your token and click Continue.`,
      'Continue',
      'Cancel'
    );

    if (proceed !== 'Continue') {
      logger.info('Login cancelled by user');
      return;
    }

    // Ask user to paste the token from the website
    const token = await showInputBox({
      prompt: 'Paste your Personal Access Token (PAT) from the website',
      password: true,
      placeHolder: 'Paste your token here...',
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Token is required';
        }
        if (value.trim().length < 10) {
          return 'Token seems too short. Please enter a valid token';
        }
        return null;
      },
    });

    if (!token) {
      logger.info('Login cancelled by user');
      return;
    }

    // Verify token with backend
    logger.info('Verifying token with backend...');
    const userProfile = await authService.verifyToken(token);

    if (!userProfile) {
      throw new Error('Invalid token or user data');
    }

    const username = userProfile.username;
    const displayName = userProfile.name || username;

    // Save authentication data
    await storageService.setAuthToken(token);
    await storageService.setUsername(username);
    await storageService.setDisplayName(displayName);

    // Update UI
    statusBar.updateForUser(username);

    // Show success message
    const action = await showSuccess(
      `Welcome ${displayName}! You're now logged in.`,
      'Sync My Setup'
    );

    if (action === 'Sync My Setup') {
      await vscode.commands.executeCommand(Commands.SYNC);
    }

    logger.info(`User logged in successfully: ${username}`);
  } catch (error) {
    const message = getUserFriendlyError(error);
    await showError(`Login failed: ${message}`);
    logger.error('Login failed', error);
  }
}

/**
 * Handle logout command
 */
export async function handleLogout(
  storageService: StorageService,
  statusBar: StatusBarManager
): Promise<void> {
  try {
    logger.info('Starting logout flow...');

    const confirm = await showWarning('Are you sure you want to logout?', 'Yes', 'No');

    if (confirm === 'Yes') {
      await storageService.clearAuth();
      statusBar.updateForLoggedOut();
      await showSuccess('Logged out successfully');
      logger.info('User logged out successfully');
    } else {
      logger.info('Logout cancelled by user');
    }
  } catch (error) {
    const message = getUserFriendlyError(error);
    await showError(`Logout failed: ${message}`);
    logger.error('Logout failed', error);
  }
}

/**
 * Handle new token command - allows updating the existing token
 */
export async function handleNewToken(
  storageService: StorageService,
  authService: AuthService,
  apiService: ApiService,
  statusBar: StatusBarManager
): Promise<void> {
  try {
    logger.info('Starting new token flow...');

    const currentUsername = storageService.getUsername();
    const isAuthenticated = storageService.isAuthenticated();

    // Show different message based on auth state
    const message = isAuthenticated
      ? `Current user: ${currentUsername}. Enter a new token to update your authentication.`
      : 'Enter your Personal Access Token to authenticate.';

    // Option to open the dashboard to generate a new token
    const action = await showInfo(message, 'Enter Token', 'Get Token from Dashboard', 'Cancel');

    if (action === 'Cancel' || !action) {
      logger.info('New token flow cancelled by user');
      return;
    }

    if (action === 'Get Token from Dashboard') {
      const authUrl = apiService.getAuthUrl();
      const uri = vscode.Uri.parse(authUrl);
      await vscode.env.openExternal(uri);

      // After opening browser, prompt for token
      const proceed = await showInfo(
        'After generating your token in the dashboard, click Continue to enter it.',
        'Continue',
        'Cancel'
      );

      if (proceed !== 'Continue') {
        logger.info('New token flow cancelled by user');
        return;
      }
    }

    // Ask user to paste the new token
    const token = await showInputBox({
      prompt: 'Paste your new Personal Access Token (PAT)',
      password: true,
      placeHolder: 'Paste your token here...',
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Token is required';
        }
        if (value.trim().length < 10) {
          return 'Token seems too short. Please enter a valid token';
        }
        return null;
      },
    });

    if (!token) {
      logger.info('New token flow cancelled - no token entered');
      return;
    }

    // Verify the new token with backend
    logger.info('Verifying new token with backend...');
    const userProfile = await authService.verifyToken(token);

    if (!userProfile) {
      throw new Error('Invalid token or user data');
    }

    const username = userProfile.username;
    const displayName = userProfile.name || username;

    // Check if this is a different user
    if (isAuthenticated && currentUsername && currentUsername !== username) {
      const confirmSwitch = await showWarning(
        `This token belongs to a different user (${displayName}). Switch accounts?`,
        'Yes, Switch',
        'Cancel'
      );

      if (confirmSwitch !== 'Yes, Switch') {
        logger.info('Account switch cancelled by user');
        return;
      }
    }

    // Save new authentication data
    await storageService.setAuthToken(token);
    await storageService.setUsername(username);
    await storageService.setDisplayName(displayName);

    // Update UI
    statusBar.updateForUser(username);

    // Show success message
    const successAction = await showSuccess(
      isAuthenticated && currentUsername === username
        ? `Token updated successfully for ${displayName}!`
        : `Welcome ${displayName}! You're now logged in.`,
      'Sync My Setup'
    );

    if (successAction === 'Sync My Setup') {
      await vscode.commands.executeCommand(Commands.SYNC);
    }

    logger.info(`Token updated successfully for user: ${username}`);
  } catch (error) {
    const message = getUserFriendlyError(error);
    await showError(`Failed to update token: ${message}`);
    logger.error('New token flow failed', error);
  }
}
