/**
 * SetupHub Sync - IDE Extension
 * Main entry point for VS Code-compatible IDEs
 */

import * as vscode from 'vscode';
import { StorageService, SetupService, ApiService, AuthService } from './services';
import { StatusBarManager } from './ui/status-bar';
import { registerCommands } from './commands';
import { showInfo, openUrl } from './ui/notifications';
import { logger, LogLevel } from './utils';
import { Commands, ConfigKeys, Defaults } from './config/constants';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext): void {
  logger.info('SetupHub Sync extension is activating...');

  // Set log level (can be configured via settings in the future)
  logger.setLevel(LogLevel.INFO);

  // Initialize services
  const storageService = new StorageService(context);
  const setupService = new SetupService();
  const apiService = new ApiService();
  const authService = new AuthService();
  const statusBar = new StatusBarManager();

  // Register commands
  registerCommands(context, {
    storage: storageService,
    setup: setupService,
    api: apiService,
    auth: authService,
    statusBar,
  });

  // Add status bar to subscriptions
  context.subscriptions.push(statusBar.getDisposable());

  // Initialize status bar based on auth state
  if (storageService.isAuthenticated()) {
    const username = storageService.getUsername()!;
    statusBar.updateForUser(username);
  } else {
    statusBar.updateForLoggedOut();
  }

  // Show welcome message on first install
  handleFirstInstall(storageService);

  // Show login reminder if user is not authenticated (and not first install)
  handleLoginReminder(storageService);

  // Setup auto-sync listener
  setupAutoSyncListener(context, storageService);

  // Listen for configuration changes
  setupConfigurationListener(context, apiService);

  logger.info('SetupHub Sync extension activated successfully');
}

/**
 * Handle first install welcome message
 */
async function handleFirstInstall(storageService: StorageService): Promise<void> {
  if (storageService.isFirstInstall()) {
    const action = await showInfo(
      'Welcome to SetupHub Sync! 🎉 Login to start sharing your IDE setup.',
      'Login',
      'Learn More'
    );

    if (action === 'Login') {
      await vscode.commands.executeCommand(Commands.LOGIN);
    } else if (action === 'Learn More') {
      await openUrl('https://github.com/dev-kraken/setuphub-dev');
    }

    await storageService.markFirstInstallComplete();
  }
}

/**
 * Handle login reminder for non-authenticated users
 */
async function handleLoginReminder(storageService: StorageService): Promise<void> {
  // Only show reminder if:
  // 1. User is NOT authenticated
  // 2. This is NOT the first install (first install has its own message)
  if (!storageService.isAuthenticated() && !storageService.isFirstInstall()) {
    const action = await showInfo("You're not logged in to SetupHub Sync", 'Login', 'Dismiss');

    if (action === 'Login') {
      await vscode.commands.executeCommand(Commands.LOGIN);
    }

    logger.info('Login reminder shown to user');
  }
}

/**
 * Setup auto-sync configuration listener
 */
function setupAutoSyncListener(
  context: vscode.ExtensionContext,
  storageService: StorageService
): void {
  let autoSyncTimeout: NodeJS.Timeout | undefined;

  const configListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
    const config = vscode.workspace.getConfiguration();
    const autoSync = config.get<boolean>(ConfigKeys.AUTO_SYNC);

    // Check if auto-sync is enabled and user is authenticated
    if (!autoSync || !storageService.isAuthenticated()) {
      return;
    }

    // Check if relevant configuration changed
    if (e.affectsConfiguration('workbench') || e.affectsConfiguration('editor')) {
      // Debounce to avoid too many syncs
      if (autoSyncTimeout) {
        clearTimeout(autoSyncTimeout);
      }

      autoSyncTimeout = setTimeout(async () => {
        const shouldSync = await showInfo('Settings changed. Sync your setup?', 'Yes', 'No');

        if (shouldSync === 'Yes') {
          await vscode.commands.executeCommand(Commands.SYNC);
        }
      }, Defaults.AUTO_SYNC_DEBOUNCE);
    }
  });

  context.subscriptions.push(configListener);
  logger.debug('Auto-sync listener configured');
}

/**
 * Setup configuration change listener for API settings
 */
function setupConfigurationListener(
  context: vscode.ExtensionContext,
  apiService: ApiService
): void {
  const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration(ConfigKeys.API_URL)) {
      apiService.reloadConfig();
      logger.info('API configuration reloaded');
    }
  });

  context.subscriptions.push(configListener);
  logger.debug('Configuration listener registered');
}

/**
 * Extension deactivation
 */
export function deactivate(): void {
  logger.info('SetupHub Sync extension deactivated');
}
