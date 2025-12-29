import { IconFileOff, IconHome, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Global 404 Not Found page.
 * Displayed when a route doesn't exist or a resource is not found.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-neutral-800 p-4">
            <IconFileOff className="h-12 w-12 text-neutral-400" />
          </div>
        </div>

        <h1 className="font-oxanium mb-3 text-6xl font-bold text-white">404</h1>

        <h2 className="font-oxanium mb-3 text-xl font-semibold text-neutral-300">Page Not Found</h2>

        <p className="mb-8 text-neutral-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <IconHome className="h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/setups">
              <IconSearch className="h-4 w-4" />
              Browse Setups
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
