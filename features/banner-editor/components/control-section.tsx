'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { memo, useState } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import type { ControlSectionProps } from '../types';

export const ControlSection = memo(function ControlSection({
  title,
  children,
  defaultOpen = false,
}: ControlSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-white/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0"
    >
      <CollapsibleTrigger
        className="w-full flex items-center justify-between py-2 text-sm font-semibold text-neutral-300 hover:text-white transition-colors group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 font-oxanium"
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <span className="group-hover:translate-x-1 transition-transform">
          {title}
        </span>
        <IconChevronDown
          className={cn(
            'w-4 h-4 text-neutral-500 transition-transform duration-300',
            isOpen && 'rotate-180 text-white'
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">{children}</CollapsibleContent>
    </Collapsible>
  );
});

ControlSection.displayName = 'ControlSection';
