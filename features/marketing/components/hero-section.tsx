import { IconDownload, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TextLoop } from '@/components/ui/text-loop';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6 py-14 md:px-8 md:py-20" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-4xl text-center">
        <h1 id="hero-heading" className="font-oxanium text-5xl leading-tight font-semibold tracking-tight md:text-7xl">
          Sync your setup. <br />
          <span className="bg-linear-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Share with the world.
          </span>
        </h1>

        <p className="font-inter mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light text-neutral-300 md:text-xl">
          Install our extension, generate a token, and instantly publish your{' '}
          <TextLoop
            className="overflow-y-clip text-lg font-medium text-white"
            transition={{
              type: 'spring',
              stiffness: 900,
              damping: 80,
              mass: 10,
            }}
            variants={{
              initial: {
                y: 20,
                rotateX: 90,
                opacity: 0,
                filter: 'blur(4px)',
              },
              animate: {
                y: 0,
                rotateX: 0,
                opacity: 1,
                filter: 'blur(0px)',
              },
              exit: {
                y: -20,
                rotateX: -90,
                opacity: 0,
                filter: 'blur(4px)',
              },
            }}
          >
            <span className="rounded-md bg-blue-500/50 px-2 py-0.5">VS Code</span>
            <span className="rounded-md bg-slate-500/50 px-2 py-0.5">Cursor</span>
            <span className="rounded-md bg-teal-500/50 px-2 py-0.5">Windsurf</span>
            <span className="rounded-md bg-orange-500/50 px-2 py-0.5">Antigravity</span>
            <span className="rounded-md bg-violet-500/50 px-2 py-0.5">Other IDEs</span>
          </TextLoop>{' '}
          profile. No manual JSON editing required.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Button
            variant="default"
            className="font-oxanium flex h-10 items-center gap-2 rounded bg-white px-6 text-base font-medium text-neutral-950 shadow-lg shadow-white/5 transition-all hover:scale-105 hover:bg-neutral-200"
          >
            <IconDownload className="size-4" aria-hidden="true" />
            Install Extension
          </Button>
          <Button
            variant="outline"
            className="font-oxanium flex h-10 items-center gap-2 rounded border border-neutral-800 bg-neutral-900/50 px-6 text-base font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-neutral-600 hover:text-white"
            asChild
          >
            <Link href="/setups">
              <IconSearch className="size-4" aria-hidden="true" />
              Browse Setups
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
export { HeroSection };
