'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import type { ControlSectionProps } from '../types';

export function ControlSection({ title, children, defaultOpen = false }: ControlSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-4 border-b border-white/5 pb-4 last:mb-0 last:border-0 last:pb-0"
    >
      <CollapsibleTrigger
        className="font-oxanium group flex w-full items-center justify-between rounded-md py-2 text-sm font-semibold text-neutral-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none"
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <span className="transition-transform group-hover:translate-x-1">{title}</span>
        <IconChevronDown
          className={cn('size-4 text-neutral-500 transition-transform duration-300', isOpen && 'rotate-180 text-white')}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

ControlSection.displayName = 'ControlSection';
