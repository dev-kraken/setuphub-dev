import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';

import { verifyAuth } from '@/lib/auth/helper';

/**
 * GET /api/user/me
 *
 * Returns the authenticated user's profile information.
 * Used by the VS Code extension to verify authentication tokens
 * and retrieve user details.
 *
 * @param req - Request object with Authorization header
 * @returns User profile with id, username, name, email, and avatar
 *
 * @example
 * GET /api/user/me
 * Headers: { Authorization: "Bearer <token>" }
 * Response: {
 *   "success": true,
 *   "user": {
 *     "id": "123",
 *     "username": "johndoe",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "avatarUrl": "https://..."
 *   }
 * }
 */
export async function GET(req: Request) {
  try {
    const session = await verifyAuth(req);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        username: session.user.username,
        name: session.user.name,
        email: session.user.email,
        avatarUrl: session.user.image,
      },
    });
  } catch (error) {
    // Re-throw navigation/framework errors (Next.js 16 best practice)
    unstable_rethrow(error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
