'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { personalAccessTokens } from '@/lib/db/schema';

import { generateToken, hashToken } from '../lib/generate-token';
import { type CreateTokenResponse, type GetTokenResponse } from '../types';

export const createToken = async (): Promise<CreateTokenResponse> => {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return {
      success: false,
      error: 'Unauthorized Request',
    };
  }

  // Check if user already has a token
  const existingToken = await db.query.personalAccessTokens.findFirst({
    where: eq(personalAccessTokens.userId, sessionUser.id),
  });

  if (existingToken) {
    return {
      success: false,
      error: 'Token already exists. Please regenerate the existing token.',
    };
  }

  // Generate plain token and hash it for storage
  const plainToken = generateToken();
  const hashedToken = hashToken(plainToken);

  const [data] = await db
    .insert(personalAccessTokens)
    .values({
      id: crypto.randomUUID(),
      name: sessionUser.name || 'Default Token',
      token: hashedToken, // Store hashed version
      userId: sessionUser.id,
      expiresAt: null,
      createdAt: new Date(),
    })
    .returning();

  return {
    success: true,
    data,
    plainToken, // Return plain token to show user ONCE
  };
};

export const updateToken = async (tokenId: string): Promise<CreateTokenResponse> => {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return {
      success: false,
      error: 'Unauthorized Request',
    };
  }

  // Verify user owns this token before updating
  const existingToken = await db.query.personalAccessTokens.findFirst({
    where: and(eq(personalAccessTokens.id, tokenId), eq(personalAccessTokens.userId, sessionUser.id)),
  });

  if (!existingToken) {
    return {
      success: false,
      error: 'Token not found or unauthorized',
    };
  }

  // Generate new plain token and hash it for storage
  const plainToken = generateToken();
  const hashedToken = hashToken(plainToken);

  const [data] = await db
    .update(personalAccessTokens)
    .set({
      token: hashedToken, // Store hashed version
      createdAt: new Date(),
    })
    .where(eq(personalAccessTokens.id, tokenId))
    .returning();

  revalidatePath('/dashboard');

  return {
    success: true,
    data,
    plainToken, // Return plain token to show user ONCE
  };
};

export const getUserToken = async (): Promise<GetTokenResponse> => {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return {
      success: false,
      error: 'Unauthorized Request',
    };
  }

  const token = await db.query.personalAccessTokens.findFirst({
    where: eq(personalAccessTokens.userId, sessionUser.id),
  });

  return {
    success: true,
    data: token ? [token] : [],
  };
};
