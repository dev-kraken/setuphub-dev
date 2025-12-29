'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { userProfile } from '@/lib/db/schema';

import { type UpdateProfileInput, updateProfileSchema } from '../lib/schemas/profile-schema';
import { type GetProfileResponse, type UpdateProfileResponse } from '../types';

/**
 * Get the current user's profile data.
 * Returns null data if profile doesn't exist yet.
 */
export async function getUserProfile(): Promise<GetProfileResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, user.id),
    });

    return {
      success: true,
      data: profile ?? null,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to fetch profile',
    };
  }
}

/**
 * Update the current user's profile.
 * Creates a new profile if one doesn't exist (upsert).
 */
export async function updateUserProfile(input: UpdateProfileInput): Promise<UpdateProfileResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Validate input
    const validationResult = updateProfileSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message ?? 'Invalid input',
      };
    }

    const { bio, websiteUrl, twitterUsername, linkedinUrl } = validationResult.data;

    // Upsert: insert new profile or update existing one
    const [upsertedProfile] = await db
      .insert(userProfile)
      .values({
        userId: user.id,
        bio: bio ?? null,
        websiteUrl: websiteUrl ?? null,
        twitterUsername: twitterUsername ?? null,
        linkedinUrl: linkedinUrl ?? null,
      })
      .onConflictDoUpdate({
        target: userProfile.userId,
        set: {
          bio: bio ?? null,
          websiteUrl: websiteUrl ?? null,
          twitterUsername: twitterUsername ?? null,
          linkedinUrl: linkedinUrl ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();

    revalidatePath('/dashboard');

    return {
      success: true,
      data: upsertedProfile,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}
