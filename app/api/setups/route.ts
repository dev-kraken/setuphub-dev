import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { verifyAuth } from '@/lib/auth/helper';
import { db } from '@/lib/db';
import { setups } from '@/lib/db/schema';
import { serverEnv } from '@/lib/env';
import { type SetupContent } from '@/types/setup';

import { createSetupSchema } from './schema/setup-schema';

/**
 * POST /api/setups
 *
 * Syncs a user's editor setup (themes, extensions, settings) to the platform.
 * Performs an upsert operation - creates new setup or updates existing one.
 *
 * @param req - Request with setup data in JSON body
 * @returns Share URL and setup ID on success
 *
 * @example
 * POST /api/setups
 * {
 *   "name": "My Setup",
 *   "editorName": "vscode",
 *   "description": "My daily setup",
 *   "isPublic": true,
 *   "theme": "Dark+",
 *   "extensions": [...],
 *   "settings": {...}
 * }
 */
export async function POST(req: Request) {
  try {
    // Validate Content-Type header
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    const session = await verifyAuth(req);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized Please add a valid personal access token' }, { status: 401 });
    }

    // Parse and validate request body with Zod
    const body = await req.json();
    const validatedData = createSetupSchema.parse(body);

    // Destructure validated data
    const { name, description, isPublic, editorName, ...setupData } = validatedData;

    // Setup content as typed object (Drizzle handles JSON serialization)
    const content = setupData as SetupContent;

    // Upsert: insert new setup or update existing one for this user + IDE
    const [upsertedSetup] = await db
      .insert(setups)
      .values({
        userId: session.user.id,
        editorName,
        name,
        description,
        content,
        isPublic,
      })
      .onConflictDoUpdate({
        target: [setups.userId, setups.editorName],
        set: {
          name,
          description,
          content,
          isPublic,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Construct the share URL
    const baseUrl = serverEnv.BETTER_AUTH_URL || 'https://setuphub.dev';
    const shareUrl = `${baseUrl}/${session.user.username}/${upsertedSetup.id}`;

    return NextResponse.json({
      success: true,
      setupId: upsertedSetup.id.toString(),
      shareUrl,
      message: 'Setup synced successfully',
    });
  } catch (error) {
    // Re-throw navigation/framework errors (Next.js 16 best practice)
    unstable_rethrow(error);

    // Handle Zod validation errors with detailed feedback
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
