/**
 * Database Schema Exports
 *
 * This file re-exports all database schema definitions.
 * Import from '@/lib/db/schema' to access any table or relation.
 */

// Authentication schemas (user, session, account, verification)
export * from './auth-schema';

// Setup-related schemas (setups, personalAccessTokens)
export * from './setup-schema';

// Setup stars (user favorites)
export * from './setup-star-schema';

// User profile (bio, social links)
export * from './user-profile-schema';
