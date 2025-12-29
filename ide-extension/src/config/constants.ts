/**
 * Centralized constants for the SetupHub Sync extension.
 * All configuration, commands, and static values are defined here.
 */

// ============================================================================
// IDE Commands
// ============================================================================

/**
 * IDE command identifiers registered by this extension
 */
export const Commands = {
  SYNC: 'setuphub.sync',
  LOGIN: 'setuphub.login',
  LOGOUT: 'setuphub.logout',
  NEW_TOKEN: 'setuphub.newToken',
  PROFILE: 'setuphub.profile',
  BROWSE: 'setuphub.browse',
} as const;

// ============================================================================
// Storage Keys
// ============================================================================

/**
 * Global state storage keys for persisting user data
 */
export const StorageKeys = {
  AUTH_TOKEN: 'authToken',
  USERNAME: 'username',
  DISPLAY_NAME: 'displayName',
  FIRST_INSTALL: 'firstInstall',
} as const;

// ============================================================================
// Configuration
// ============================================================================

/**
 * Configuration keys for workspace settings
 */
export const ConfigKeys = {
  AUTO_SYNC: 'setuphub.autoSync',
  API_URL: 'setuphub.apiUrl',
} as const;

/**
 * Default configuration values
 *
 * NOTE: The API_URL default is also defined in package.json (setuphub.apiUrl.default).
 * If you change this value, make sure to update package.json as well to keep them in sync.
 */
export const Defaults = {
  /** Default API URL - also defined in package.json setuphub.apiUrl.default */
  API_URL: 'https://setuphub.dev/api',
  AUTO_SYNC_DEBOUNCE: 5000,
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3,
} as const;

// ============================================================================
// UI Messages
// ============================================================================

/**
 * Progress messages displayed during sync operation
 */
export const ProgressMessages = {
  COLLECTING: 'Collecting data...',
  UPLOADING: 'Uploading to server...',
  FINALIZING: 'Almost done...',
} as const;
