import { IconChevronRight, IconCopy, IconHeartShare, IconPalette, IconTypography } from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ResultCard = () => {
  return (
    <div className="glass-panel animate-float relative col-span-2 h-full overflow-hidden rounded-xl bg-[#0A0A0A] shadow-2xl ring-1 ring-white/10 md:-translate-x-4">
      <div className="relative flex h-28 flex-col justify-between bg-linear-to-br from-rose-500/10 via-purple-500/5 to-transparent p-6">
        <div className="absolute top-4 right-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-500/10 bg-rose-500/10 backdrop-blur">
            <IconHeartShare className="size-4 text-rose-500" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src="/images/dev-kraken.png" alt="Dev Kraken" title="Dev Kraken" />
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-oxanium text-lg font-medium text-white">Dev Kraken</h3>
            <p className="font-oxanium text-sm text-neutral-500">@devkraken</p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-2 pb-4">
        <div className="mb-4 text-[10px] font-semibold tracking-widest text-neutral-600 uppercase">Current Stack</div>

        <div className="space-y-3">
          <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-[#7aa2f7]/20 bg-[#7aa2f7]/10">
                <IconPalette className="size-4 text-[#7aa2f7]" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">Monokai</div>
                <div className="text-[10px] text-neutral-500">Color Theme</div>
              </div>
            </div>
            <IconChevronRight className="size-3 text-neutral-600 transition-colors group-hover:text-white" />
          </div>

          <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-[#bb9af7]/20 bg-[#bb9af7]/10">
                <IconTypography className="size-4 text-[#bb9af7]" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">Iosevka</div>
                <div className="text-[10px] text-neutral-500">Typography</div>
              </div>
            </div>
            <IconChevronRight className="size-3 text-neutral-600 transition-colors group-hover:text-white" />
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-t border-white/5 pt-4">
          <div className="group/link flex flex-1 cursor-pointer items-center justify-between rounded border border-white/10 bg-neutral-900 px-3 py-2 hover:border-neutral-700">
            <span className="font-mono text-[10px] text-neutral-500">@devkraken</span>
            <IconCopy className="size-3 text-neutral-600 transition-colors group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

ResultCard.displayName = 'ResultCard';
export { ResultCard };
