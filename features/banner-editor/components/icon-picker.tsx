'use client';

import { Check, ChevronsUpDown, Filter } from 'lucide-react';
import * as React from 'react';
import { type CellComponentProps,Grid } from 'react-window';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput } from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { ICON_CATEGORIES, ICON_LIST, type IconMeta } from '../lib/icons';

/** Grid configuration */
const COLUMN_COUNT = 7;
const CELL_SIZE = 46; // 40px button + 8px gap
const GRID_HEIGHT = 240;

/** Props for the icon picker component */
interface IconPickerProps {
  value?: string;
  onChange?: (iconName: string) => void;
  className?: string;
}

/** Memoized icon button component for performance */
const IconButton = React.memo(function IconButton({
  icon,
  isSelected,
  onSelect,
}: {
  icon: IconMeta;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const IconComp = icon.component;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
        isSelected
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      title={icon.name}
      aria-label={`Select ${icon.name} icon`}
      role="radio"
      aria-checked={isSelected}
    >
      <IconComp size={20} stroke={1.5} />
    </button>
  );
});

IconButton.displayName = 'IconButton';

/** Cell props for virtualized grid */
interface IconCellProps {
  icons: IconMeta[];
  selectedValue: string | undefined;
  onSelect: (iconName: string) => void;
}

/** Virtualized grid cell component */
function IconCell({
  columnIndex,
  rowIndex,
  style,
  icons,
  selectedValue,
  onSelect,
}: CellComponentProps<IconCellProps>) {
  const index = rowIndex * COLUMN_COUNT + columnIndex;
  const icon = icons[index];

  if (!icon) return null;

  return (
    <div style={style} className="flex items-center justify-center p-1 w-full h-full">
      <IconButton
        icon={icon}
        isSelected={selectedValue === icon.name}
        onSelect={() => onSelect(icon.name)}
      />
    </div>
  );
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Find the selected icon data
  const selectedIcon = React.useMemo(() => {
    return ICON_LIST.find((icon) => icon.name === value);
  }, [value]);

  // Filter icons based on search and category
  const filteredIcons = React.useMemo(() => {
    const searchLower = search.toLowerCase();

    return ICON_LIST.filter((icon) => {
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!search) return true;

      // Match against name and keywords
      return (
        icon.name.toLowerCase().includes(searchLower) ||
        icon.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
      );
    });
  }, [search, selectedCategory]);

  // Handle icon selection
  const handleSelect = React.useCallback(
    (iconName: string) => {
      onChange?.(iconName);
      setIsOpen(false);
    },
    [onChange],
  );

  // Calculate grid dimensions
  const rowCount = Math.ceil(filteredIcons.length / COLUMN_COUNT);

  // Memoize cell props to prevent unnecessary re-renders
  const cellProps = React.useMemo(
    () => ({
      icons: filteredIcons,
      selectedValue: value,
      onSelect: handleSelect,
    }),
    [filteredIcons, value, handleSelect],
  );

  const SelectedIconComp = selectedIcon?.component;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select icon"
          className={cn('group relative h-12 w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            {SelectedIconComp && <SelectedIconComp size={20} stroke={1.5} className="text-muted-foreground" />}
            <span className="truncate">{selectedIcon?.name ?? 'Select icon...'}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)" align="start">
        <Command className="w-full" shouldFilter={false}>
          <CommandInput
            placeholder="Search icons..."
            value={search}
            onValueChange={setSearch}
            className="border-none focus:ring-0 font-oxanium text-sm font-medium"
          />
          <div className="flex w-full items-center justify-between gap-2 border-b px-3 py-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-accent flex h-8 items-center gap-2 px-2">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm capitalize font-oxanium font-medium">{selectedCategory === 'all' ? 'All' : selectedCategory}</span>
                  <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                  <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                  {ICON_CATEGORIES.map((category) => (
                    <DropdownMenuRadioItem key={category} value={category} className="capitalize font-oxanium font-medium">
                      {category}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-muted-foreground text-xs font-oxanium font-medium">{filteredIcons.length} icons</span>
          </div>
          {filteredIcons.length === 0 ? (
            <CommandEmpty>No icons found.</CommandEmpty>
          ) : (
            <CommandGroup>
              <div className="p-2" role="radiogroup" aria-label="Icon selection">
                <Grid
                  columnCount={COLUMN_COUNT}
                  columnWidth={CELL_SIZE}
                  defaultHeight={GRID_HEIGHT}
                  rowCount={rowCount}
                  rowHeight={CELL_SIZE}
                  cellComponent={IconCell}
                  cellProps={cellProps}
                  className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                  style={{ height: GRID_HEIGHT, width: '100%' }}
                />
              </div>
            </CommandGroup>
          )}
        </Command>
        {/* Selected icon indicator */}
        {value && (
          <div className="flex items-center gap-2 border-t px-3 py-2">
            <Check className="h-3.5 w-3.5 text-green-500" />
            <span className="text-muted-foreground text-xs font-oxanium font-medium">Selected: {value}</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
