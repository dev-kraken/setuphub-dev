/**
 * Input validation and sanitization utilities
 */

import { ValidationError } from './errors';

/** Maximum allowed length for setup names */
const MAX_NAME_LENGTH = 100;

/** Maximum allowed length for descriptions */
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Validates a setup name
 *
 * @param name - The name to validate
 * @throws {ValidationError} When name is invalid
 */
export function validateSetupName(name: string | undefined): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Setup name is required', 'name');
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Setup name must be less than ${MAX_NAME_LENGTH} characters`, 'name');
  }
}

/**
 * Validates a description
 *
 * @param description - The description to validate
 * @throws {ValidationError} When description is invalid
 */
export function validateDescription(description: string | undefined): void {
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
      'description'
    );
  }
}

/**
 * Validates a URL format
 *
 * @param url - The URL string to validate
 * @returns True if the URL is valid
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes user input by removing potentially harmful characters
 * Removes HTML tags, script injection patterns, and excessive whitespace
 *
 * @param input - The raw user input
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"'`]/g, '') // Remove potentially dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/\s+/g, ' '); // Normalize whitespace
}
