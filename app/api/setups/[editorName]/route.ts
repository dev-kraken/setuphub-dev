import { and, eq } from 'drizzle-orm';
import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { verifyAuth } from '@/lib/auth/helper';
import { db } from '@/lib/db';
import { setups } from '@/lib/db/schema';

import { editorNameParamSchema } from '../schema/setup-schema';

/**
 * GET /api/setups/[editorName]
 *
 * Retrieves the authenticated user's existing setup for a specific editor.
 * Used by the VS Code extension to check if a user has previously synced
 * their setup for this editor.
 *
 * @param req - Request object
 * @param params - Dynamic route params containing editorName
 * @returns Setup name and description if found, 404 otherwise
 *
 * @example
 * GET /api/setups/vscode
 * Response: { "name": "My Setup", "description": "..." }
 */
export async function GET(req: Request, { params }: { params: Promise<{ editorName: string }> }) {
  try {
    const session = await verifyAuth(req);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await and validate params
    const rawParams = await params;
    const { editorName } = editorNameParamSchema.parse(rawParams);

    // Find existing setup for this user + IDE
    const existingSetup = await db.query.setups.findFirst({
      where: and(eq(setups.userId, session.user.id), eq(setups.editorName, editorName)),
      columns: {
        name: true,
        description: true,
      },
    });

    if (!existingSetup) {
      return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
    }

    return NextResponse.json(existingSetup);
  } catch (error) {
    // Re-throw navigation/framework errors (Next.js 16 best practice)
    unstable_rethrow(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid editor name',
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
