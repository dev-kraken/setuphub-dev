import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { serverEnv } from '@/lib/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL: serverEnv.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        unique: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: profile.email ? true : false,
          username: profile.login, // Map GitHub login to username
        };
      },
    },
  },
});
