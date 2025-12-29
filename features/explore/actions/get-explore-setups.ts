'use server';

import { and, desc, eq, inArray, lt } from 'drizzle-orm';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars, user } from '@/lib/db/schema';
import { type SetupWithUser } from '@/types/setup';

/** Number of setups to fetch per page */
const PAGE_SIZE = 10;

export interface GetExploreSetupsParams {
  /** Cursor for pagination (setup ID to start after) */
  cursor?: string;
  /** Number of items to fetch (defaults to PAGE_SIZE) */
  limit?: number;
}

export interface GetExploreSetupsResult {
  /** Array of public setups with user data */
  setups: SetupWithUser[];
  /** Next cursor for pagination (null if no more results) */
  nextCursor: string | null;
  /** Whether there are more results to fetch */
  hasMore: boolean;
}

/**
 * Fetches public setups with cursor-based pagination.
 * Uses denormalized starCount for performance.
 *
 * @param params - Pagination parameters
 * @returns Paginated setups with user data and star information
 */
export async function getExploreSetups(params: GetExploreSetupsParams = {}): Promise<GetExploreSetupsResult> {
  const { cursor, limit = PAGE_SIZE } = params;
  const currentUser = await getCurrentUser();

  // Build query conditions
  const conditions = [eq(setups.isPublic, true)];

  // Add cursor condition for pagination
  if (cursor) {
    conditions.push(lt(setups.id, cursor));
  }

  // Fetch public setups with user info, ordered by newest first
  const publicSetups = await db
    .select()
    .from(setups)
    .where(and(...conditions))
    .innerJoin(user, eq(setups.userId, user.id))
    .orderBy(desc(setups.id))
    .limit(limit + 1); // Fetch one extra to check if there are more

  // Check if there are more results
  const hasMore = publicSetups.length > limit;
  const setupsToReturn = hasMore ? publicSetups.slice(0, limit) : publicSetups;

  if (setupsToReturn.length === 0) {
    return { setups: [], nextCursor: null, hasMore: false };
  }

  // Get the next cursor (last item's ID)
  const nextCursor = hasMore ? setupsToReturn[setupsToReturn.length - 1].setups.id : null;

  // Check which setups the current user has starred (if logged in)
  let userStarredSet = new Set<string>();
  if (currentUser) {
    const setupIds = setupsToReturn.map((s) => s.setups.id);
    const userStars = await db
      .select({ setupId: setupStars.setupId })
      .from(setupStars)
      .where(and(eq(setupStars.userId, currentUser.id), inArray(setupStars.setupId, setupIds)));

    userStarredSet = new Set(userStars.map((s) => s.setupId));
  }

  // Combine the data with star information
  const setupsWithStars: SetupWithUser[] = setupsToReturn.map((setup) => ({
    ...setup,
    starData: {
      isStarred: userStarredSet.has(setup.setups.id),
      starCount: setup.setups.starCount,
    },
  }));

  return {
    setups: setupsWithStars,
    nextCursor,
    hasMore,
  };
}
