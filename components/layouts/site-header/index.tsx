import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/lib/auth/config';

import AuthButtons from './auth-buttons';
import SiteNav from './nav';

const SiteHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <header className="glass fixed top-0 z-50 w-full border-b border-neutral-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" title="Go to Homepage" aria-label="Go to Homepage" className="flex items-center gap-2">
            <Image
              src="/images/logos/brand-light.svg"
              alt="SetupHub Logo"
              title="SetupHub Logo"
              width={140}
              height={140}
            />
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <SiteNav />
        <AuthButtons user={user} />
      </div>
    </header>
  );
};

export default SiteHeader;
