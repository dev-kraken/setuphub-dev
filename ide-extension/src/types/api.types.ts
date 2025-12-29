/**
 * API request and response types
 */

import { UserSetup } from "./setup.types";

/**
 * Request payload for syncing setup
 */
export type SyncSetupRequest = UserSetup;

/**
 * Response from setup sync endpoint
 */
export interface SyncSetupResponse {
  /** Whether the sync was successful */
  success: boolean;
  /** Shareable URL for the setup */
  shareUrl: string;
  /** Setup ID in the database */
  setupId: string;
  /** Optional message */
  message?: string;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  /** Error message */
  error: string;
  /** HTTP status code */
  statusCode?: number;
  /** Additional error details */
  details?: unknown;
}

/**
 * API configuration
 */
export interface ApiConfig {
  /** Base API URL */
  baseUrl: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Retry attempts for failed requests */
  retries?: number;
}
