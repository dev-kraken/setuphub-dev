import { IconTransfer } from '@tabler/icons-react';

import { ResultCard } from './result-card';
import { SourceCard } from './source-card';

const VisualSection = () => {
  return (
    <section id="visual" className="perspective-1000 relative mx-auto max-w-6xl py-12">
      <div className="absolute top-1/2 left-1/2 z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[60px]"></div>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-5">
        <SourceCard />

        <div className="col-span-1 flex rotate-90 items-center justify-center text-white/20 md:rotate-0">
          <IconTransfer className="size-14 animate-pulse text-neutral-500" />
        </div>

        <ResultCard />
      </div>
    </section>
  );
};

VisualSection.displayName = 'VisualSection';
export { VisualSection };
