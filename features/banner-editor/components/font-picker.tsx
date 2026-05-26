'use client';

import { Check, ChevronsUpDown, Filter } from 'lucide-react';
import * as React from 'react';
import { List } from 'react-window';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { getGoogleFonts } from '../actions/fonts';
import type { GoogleFont } from '../lib/fonts';
import { loadFont } from '../lib/fonts';

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;
const ROW_HEIGHT = 55;

interface FontListItemProps {
  font: GoogleFont;
  isSelected: boolean;
  onSelect: () => void;
}

interface FontRowProps {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
}

function FontListItem({ font, isSelected, onSelect }: FontListItemProps) {
  const [hasFontLoaded, setHasFontLoaded] = React.useState(false);

  React.useEffect(() => {
    if (hasFontLoaded) return;
    loadFont(font.family).then((result) => {
      if (result.success) {
        setHasFontLoaded(true);
      } else {
        console.error('Failed to load font:', result.error);
      }
    });
  }, [hasFontLoaded, font.family]);

  return (
    <CommandItem
      value={font.family}
      onSelect={onSelect}
      className="data-[selected=true]:bg-accent flex w-full cursor-pointer items-center gap-2 p-2"
      data-selected={isSelected}
    >
      <Check className={cn('size-3 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{font.family}</span>
        <span
          className={cn(
            'text-muted-foreground text-xs transition-opacity duration-300',
            hasFontLoaded ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            fontFamily: hasFontLoaded ? font.family : 'system-ui',
          }}
        >
          The quick brown fox
        </span>
      </div>
    </CommandItem>
  );
}

interface FontPickerProps {
  onChange?: (font: GoogleFont['family']) => void;
  value?: string;
  width?: number;
  height?: number;
  className?: string;
  showFilters?: boolean;
}

export function FontPicker({
  onChange,
  value,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  showFilters = true,
}: FontPickerProps) {
  const [search, setSearch] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [fonts, setFonts] = React.useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch the font catalog once; it doesn't depend on the selected value.
  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getGoogleFonts()
      .then((fetchedFonts) => {
        if (cancelled) return;
        setFonts(fetchedFonts);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const wrapped = err instanceof Error ? err : new Error('Failed to load fonts');
        setError(wrapped);
        console.error('Error loading fonts:', wrapped);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedFont = React.useMemo(
    () => (value ? fonts.find((f) => f.family === value) ?? null : null),
    [fonts, value],
  );

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(fonts.map((font) => font.category));
    return Array.from(uniqueCategories).sort();
  }, [fonts]);

  const filteredFonts = React.useMemo(() => {
    const query = search.toLowerCase();
    return fonts.filter((font: GoogleFont) => {
      const matchesSearch = font.family.toLowerCase().includes(query);
      const matchesCategory = !showFilters || selectedCategory === 'all' || font.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [fonts, search, selectedCategory, showFilters]);

  const handleSelectFont = React.useCallback(
    (font: GoogleFont) => {
      onChange?.(font.family);
      setIsOpen(false);
    },
    [onChange],
  );

  const RowComponent = React.useCallback(
    ({ index, style, ariaAttributes }: FontRowProps) => {
      const font = filteredFonts[index];
      if (!font) return null;
      return (
        <div style={style} {...ariaAttributes}>
          <FontListItem
            font={font}
            isSelected={selectedFont?.family === font.family}
            onSelect={() => handleSelectFont(font)}
          />
        </div>
      );
    },
    [filteredFonts, selectedFont, handleSelectFont],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select font"
          className={cn('group relative h-12 w-full justify-between', className)}
        >
          <span className="font-oxanium truncate text-sm font-medium">{selectedFont?.family ?? 'Select font...'}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start" style={{ width, height: '100%' }}>
        <Command className="w-(--radix-popover-trigger-width)">
          <CommandInput
            placeholder="Search fonts..."
            value={search}
            onValueChange={setSearch}
            className="font-oxanium border-none text-sm font-medium focus:ring-0"
          />
          <div className="flex w-full items-center justify-between gap-2 border-b px-3 py-1">
            {showFilters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-accent flex h-8 w-full items-center gap-2 px-2">
                    <Filter className="text-muted-foreground size-4" />
                    <span className="text-sm capitalize">
                      {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                    </span>
                    <ChevronsUpDown className="ml-2 size-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                    <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                    {categories.map((category) => (
                      <DropdownMenuRadioItem key={category} value={category} className="capitalize">
                        {category}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <span className="text-muted-foreground text-xs">{filteredFonts.length} fonts</span>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="border-primary size-4 animate-spin rounded-full border-b-2" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4 text-sm text-red-500">
              Failed to load fonts. Please try again later.
            </div>
          ) : (
            <>
              <CommandEmpty>No fonts found.</CommandEmpty>
              <CommandGroup>
                <div style={{ height }}>
                  <List
                    rowCount={filteredFonts.length}
                    rowHeight={ROW_HEIGHT}
                    rowComponent={RowComponent}
                    rowProps={{}}
                    defaultHeight={height}
                    style={{ height }}
                  />
                </div>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
