'use server';

import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars } from '@/lib/db/schema';

export interface StarSetupResult {
  success: boolean;
  message: string;
  isStarred?: boolean;
  starCount?: number;
}

/**
 * Toggles the star status for a setup.
 * Updates the denormalized starCount for performance.
 *
 * Note: neon-http driver doesn't support transactions, so operations
 * are executed sequentially. The star count may briefly be inconsistent.
 */
export async function toggleSetupStar(setupId: string): Promise<StarSetupResult> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: 'Please sign in to star setups',
      };
    }

    const setup = await db.query.setups.findFirst({
      where: eq(setups.id, setupId),
    });

    if (!setup) {
      return {
        success: false,
        message: 'Setup not found',
      };
    }

    // Check if user already starred this setup
    const existingStar = await db.query.setupStars.findFirst({
      where: and(eq(setupStars.userId, user.id), eq(setupStars.setupId, setupId)),
    });

    let isStarred: boolean;
    let newStarCount: number;

    if (existingStar) {
      // Remove the star and decrement count
      await db.delete(setupStars).where(and(eq(setupStars.userId, user.id), eq(setupStars.setupId, setupId)));

      await db
        .update(setups)
        .set({ starCount: sql`GREATEST(${setups.starCount} - 1, 0)` })
        .where(eq(setups.id, setupId));

      isStarred = false;
      newStarCount = Math.max(0, setup.starCount - 1);
    } else {
      // Add the star and increment count
      await db.insert(setupStars).values({
        userId: user.id,
        setupId: setup.id,
      });

      await db
        .update(setups)
        .set({ starCount: sql`${setups.starCount} + 1` })
        .where(eq(setups.id, setupId));

      isStarred = true;
      newStarCount = setup.starCount + 1;
    }

    revalidatePath('/');

    return {
      success: true,
      message: isStarred ? '⭐ Added to your favorites!' : 'Removed from favorites',
      isStarred,
      starCount: newStarCount,
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
