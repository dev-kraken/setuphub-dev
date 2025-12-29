'use server';

import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { setups } from '@/lib/db/schema';

// ============================================================================
// Types
// ============================================================================

export interface UserStats {
  totalSetups: number;
  totalStars: number;
}

// ============================================================================
// Actions
// ============================================================================

/**
 * Fetches user statistics including total setups and total stars received.
 * Uses denormalized starCount column for efficient star counting.
 *
 * @param userId - The ID of the user to fetch stats for
 * @returns UserStats object with totalSetups and totalStars
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Single query to get both counts using denormalized starCount
    const [result] = await db
      .select({
        totalSetups: sql<number>`count(*)::int`,
        totalStars: sql<number>`COALESCE(sum(${setups.starCount}), 0)::int`,
      })
      .from(setups)
      .where(and(eq(setups.userId, userId), eq(setups.isPublic, true)));

    return {
      totalSetups: result?.totalSetups ?? 0,
      totalStars: result?.totalStars ?? 0,
    };
  } catch {
    return {
      totalSetups: 0,
      totalStars: 0,
    };
  }
}
