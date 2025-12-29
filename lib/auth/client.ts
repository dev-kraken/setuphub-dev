import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import { clientEnv } from '@/lib/env';

const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        username: {
          type: 'string',
          required: true,
        },
      },
    }),
  ],
});

interface SignInProps {
  callbackURL?: string;
}

type SignInReturn = ReturnType<typeof authClient.signIn.social>;

const signIn = async ({ callbackURL }: SignInProps): Promise<SignInReturn> => {
  return await authClient.signIn.social({
    provider: 'github',
    callbackURL: callbackURL ?? '/dashboard',
  });
};

const signOut = async () => {
  const data = await authClient.signOut();
  return data;
};

export { signIn, signOut };
