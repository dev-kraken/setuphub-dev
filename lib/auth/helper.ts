import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { hashToken } from '@/features/dashboard/lib/generate-token';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { personalAccessTokens, user } from '@/lib/db/schema';

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get('Authorization');

  // 1. Check for Personal Access Token (PAT)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const plainToken = authHeader.replace('Bearer ', '');

    try {
      // Hash the incoming token and look up directly (O(1) lookup)
      const hashedToken = hashToken(plainToken);

      const pat = await db.query.personalAccessTokens.findFirst({
        where: eq(personalAccessTokens.token, hashedToken),
        with: {
          user: true,
        },
      });

      if (pat) {
        // Check expiry
        if (pat.expiresAt && pat.expiresAt < new Date()) {
          return null;
        }

        // Update lastUsedAt (fire and forget - don't await)
        db.update(personalAccessTokens)
          .set({ lastUsedAt: new Date() })
          .where(eq(personalAccessTokens.id, pat.id))
          .execute()
          .catch(() => {});

        // If relation isn't set up yet, fetch user manually
        const dbUser =
          pat.user ||
          (await db.query.user.findFirst({
            where: eq(user.id, pat.userId),
          }));

        if (dbUser) {
          return {
            user: dbUser,
            session: {
              id: 'pat-session',
              userId: dbUser.id,
              expiresAt: pat.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // Long expiry
              token: pat.token,
              createdAt: pat.createdAt,
              updatedAt: pat.createdAt,
              ipAddress: null,
              userAgent: null,
            },
          };
        }
      }
    } catch {
      // PAT verification failed
    }
  }

  // Fallback to Better Auth Session (cookies) for web UI access only
  // We still need this for the dashboard where users generate tokens
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
