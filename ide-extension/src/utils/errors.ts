/**
 * Custom error classes for the SetupHub extension
 */

/** Error codes for categorizing errors */
export const ErrorCodes = {
  AUTH: 'AUTH_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
} as const;

/**
 * Base error class for all SetupHub extension errors
 */
export class SetupHubError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'SetupHubError';
    Object.setPrototypeOf(this, SetupHubError.prototype);
  }
}

/**
 * Authentication-related errors (invalid token, expired session, etc.)
 */
export class AuthenticationError extends SetupHubError {
  constructor(message: string) {
    super(message, ErrorCodes.AUTH);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * API communication errors (server errors, bad responses, etc.)
 */
export class ApiError extends SetupHubError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message, ErrorCodes.API);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Validation errors (invalid input, failed constraints, etc.)
 */
export class ValidationError extends SetupHubError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, ErrorCodes.VALIDATION);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Network-related errors (connection refused, timeout, etc.)
 */
export class NetworkError extends SetupHubError {
  constructor(message: string) {
    super(message, ErrorCodes.NETWORK);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Extract a user-friendly error message from various error types
 *
 * @param error - The error to extract message from
 * @returns A human-readable error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof SetupHubError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if an error is network-related
 *
 * @param error - The error to check
 * @returns True if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('econnrefused') ||
      message.includes('timeout') ||
      message.includes('enotfound')
    );
  }

  return false;
}
