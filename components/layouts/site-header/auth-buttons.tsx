'use client';

import { IconBrandGithub, IconBrandTabler, IconLoader } from '@tabler/icons-react';
import { type User } from 'better-auth';
import Link from 'next/link';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth/client';

interface AuthButtonsProps {
  user?: User | null;
}

const AuthButtons = ({ user }: AuthButtonsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(async () => {
      const result = await signIn({});
      if (result?.error) toast.error(result.error);
    });
  };

  const isLoggedIn = Boolean(user?.id);

  return (
    <Button
      variant="outline"
      className="font-oxanium flex items-center gap-1 text-sm font-medium"
      onClick={!isLoggedIn ? handleSignIn : undefined}
      asChild={isLoggedIn}
      disabled={isPending}
    >
      {isLoggedIn ? (
        <Link href="/dashboard">
          <IconBrandTabler />
          Dashboard
        </Link>
      ) : isPending ? (
        <React.Fragment>
          <IconLoader className="animate-spin" />
          Signing in...
        </React.Fragment>
      ) : (
        <React.Fragment>
          <IconBrandGithub />
          Sign In
        </React.Fragment>
      )}
    </Button>
  );
};

export default AuthButtons;
