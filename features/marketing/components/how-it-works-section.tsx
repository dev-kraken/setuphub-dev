import { IconBlocks, IconGlobe } from '@tabler/icons-react';
import { Key } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="px-6 py-12">
      <div className="mx-auto max-w-6xl" aria-labelledby="how-it-works-heading">
        <div className="mb-8 text-center">
          <h2 className="font-oxanium text-2xl leading-tight font-semibold tracking-tight md:text-3xl">How it works</h2>
          <p className="mx-auto max-w-xl leading-relaxed font-light text-neutral-400">
            Sync your setup. Share with the world.
          </p>
        </div>

        <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="absolute top-6 right-[16%] left-[16%] -z-10 hidden h-px border-t border-dashed border-neutral-800 bg-linear-to-r from-transparent via-neutral-800 to-transparent md:block"
            aria-hidden="true"
          />

          <li className="group relative flex flex-col items-center text-center">
            <div className="z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white shadow-sm transition-colors group-hover:border-neutral-600">
              <IconBlocks className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-oxanium mb-2 text-xl leading-tight font-semibold tracking-tight text-white">
              1. Install Extension
            </h3>
            <p className="max-w-[250px] text-base leading-relaxed text-neutral-300">
              Search for <span className="text-neutral-300">Sync.ide</span> in the VS Code marketplace and install.
            </p>
          </li>

          <li className="group relative flex flex-col items-center text-center">
            <div className="z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white shadow-sm transition-colors group-hover:border-neutral-600">
              <Key className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-oxanium mb-2 text-xl leading-tight font-semibold tracking-tight text-white">
              2. Generate Token
            </h3>
            <p className="max-w-[250px] text-base leading-relaxed text-neutral-300">
              Run{' '}
              <code className="font-oxanium rounded border border-blue-500/20 bg-blue-500/10 px-1 py-0.5 text-sm text-blue-400">
                SetupHub: Sync My Setup
              </code>{' '}
              to create your secure access token.
            </p>
          </li>

          <li className="group relative flex flex-col items-center text-center">
            <div className="z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white shadow-sm transition-colors group-hover:border-neutral-600">
              <IconGlobe className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-oxanium mb-2 text-xl leading-tight font-semibold tracking-tight text-white">
              3. Publish &amp; Share
            </h3>
            <p className="max-w-[250px] text-base leading-relaxed text-neutral-300">
              Your profile is instantly live. Copy the link or embed it in your portfolio.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
};

HowItWorksSection.displayName = 'HowItWorksSection';

export { HowItWorksSection };
