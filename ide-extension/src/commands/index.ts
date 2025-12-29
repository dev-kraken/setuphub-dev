/**
 * Command registration and initialization
 */

import * as vscode from 'vscode';
import { StorageService, SetupService, ApiService, AuthService } from '../services';
import { StatusBarManager } from '../ui/status-bar';
import { handleLogin, handleLogout, handleNewToken } from './auth.command';
import { handleViewProfile, handleBrowseSetups } from './profile.command';
import { handleSyncSetup } from './sync.command';
import { Commands } from '../config/constants';
import { logger } from '../utils';

/**
 * Register all extension commands
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  services: {
    storage: StorageService;
    setup: SetupService;
    api: ApiService;
    auth: AuthService;
    statusBar: StatusBarManager;
  }
): void {
  logger.info('Registering commands...');

  const { storage, setup, api, auth, statusBar } = services;

  // Sync command
  const syncCommand = vscode.commands.registerCommand(Commands.SYNC, async () => {
    await handleSyncSetup(storage, setup, api);
  });

  // Login command
  const loginCommand = vscode.commands.registerCommand(Commands.LOGIN, async () => {
    await handleLogin(storage, auth, api, statusBar);
  });

  // Logout command
  const logoutCommand = vscode.commands.registerCommand(Commands.LOGOUT, async () => {
    await handleLogout(storage, statusBar);
  });

  // New Token command
  const newTokenCommand = vscode.commands.registerCommand(Commands.NEW_TOKEN, async () => {
    await handleNewToken(storage, auth, api, statusBar);
  });

  // Profile command
  const profileCommand = vscode.commands.registerCommand(Commands.PROFILE, async () => {
    await handleViewProfile(storage, api);
  });

  // Browse command
  const browseCommand = vscode.commands.registerCommand(Commands.BROWSE, async () => {
    await handleBrowseSetups(api);
  });

  // Add to subscriptions
  context.subscriptions.push(
    syncCommand,
    loginCommand,
    logoutCommand,
    newTokenCommand,
    profileCommand,
    browseCommand
  );

  logger.info('All commands registered successfully');
}
