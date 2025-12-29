'use server';

import { ilike, or, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

// ============================================================================
// Types
// ============================================================================

export interface SearchUser {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

export interface SearchUsersResult {
  users: SearchUser[];
  hasMore: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SEARCH_LIMIT = 5;
const MIN_SEARCH_LENGTH = 2;

// ============================================================================
// Actions
// ============================================================================

/**
 * Searches users by username or name.
 * Returns matching users with pagination support.
 *
 * @param query - The search query string
 * @returns SearchUsersResult with matching users
 */
export async function searchUsers(query: string): Promise<SearchUsersResult> {
  try {
    // Validate input
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
      return { users: [], hasMore: false };
    }

    // Build search pattern for ILIKE (case-insensitive)
    const searchPattern = `%${trimmedQuery}%`;

    // Search users by username or name
    const results = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      })
      .from(user)
      .where(or(ilike(user.username, searchPattern), ilike(user.name, searchPattern)))
      .orderBy(
        // Prioritize exact matches, then prefix matches
        sql`CASE 
          WHEN LOWER(${user.username}) = LOWER(${trimmedQuery}) THEN 0
          WHEN LOWER(${user.username}) LIKE LOWER(${trimmedQuery + '%'}) THEN 1
          WHEN LOWER(${user.name}) = LOWER(${trimmedQuery}) THEN 2
          WHEN LOWER(${user.name}) LIKE LOWER(${trimmedQuery + '%'}) THEN 3
          ELSE 4
        END`,
        user.username,
      )
      .limit(SEARCH_LIMIT + 1);

    // Check if there are more results
    const hasMore = results.length > SEARCH_LIMIT;
    const users = results.slice(0, SEARCH_LIMIT);

    return { users, hasMore };
  } catch {
    return { users: [], hasMore: false };
  }
}
