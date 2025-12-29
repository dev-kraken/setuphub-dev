'use client';

import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for the application.
 * Catches unhandled errors and displays a user-friendly message.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development, could send to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <IconAlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <h1 className="font-oxanium mb-3 text-3xl font-bold text-white">Something went wrong</h1>

        <p className="mb-6 text-neutral-400">
          An unexpected error occurred. Our team has been notified and we&apos;re working to fix it.
        </p>

        {error.digest && <p className="mb-6 font-mono text-xs text-neutral-600">Error ID: {error.digest}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <IconRefresh className="h-4 w-4" />
            Try Again
          </Button>

          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
