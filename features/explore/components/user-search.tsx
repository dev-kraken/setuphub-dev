'use client';

import { IconSearch, IconUser, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { type SearchUser, searchUsers } from '../actions/search-users';
import { useDebounce } from '../hooks/use-debounce';

// ============================================================================
// Types
// ============================================================================

interface UserSearchProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Callback when a user is selected */
  onSelect?: (user: SearchUser) => void;
}

// ============================================================================
// Sub-Components
// ============================================================================

function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

interface SearchResultItemProps {
  user: SearchUser;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

function SearchResultItem({ user, isHighlighted, onSelect, onMouseEnter }: SearchResultItemProps) {
  const userInitial = user.name?.[0] ?? user.username?.[0] ?? '?';

  return (
    <Link
      href={`/${user.username}`}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 transition-colors',
        'hover:bg-white/5 focus:bg-white/5 focus:outline-none',
        isHighlighted && 'bg-white/5',
      )}
    >
      <Avatar className="size-10 border border-neutral-800">
        <AvatarImage src={user.image || ''} alt={`${user.name}'s avatar`} />
        <AvatarFallback className="bg-neutral-800 text-sm text-neutral-400">{userInitial}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{user.name}</p>
        <p className="truncate text-xs text-neutral-500">@{user.username}</p>
      </div>
    </Link>
  );
}

interface EmptyStateProps {
  query: string;
}

function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 rounded-full bg-neutral-800/50 p-3">
        <IconUser className="size-6 text-neutral-500" />
      </div>
      <p className="text-sm font-medium text-neutral-400">No users found</p>
      <p className="mt-1 text-xs text-neutral-600">No results for &quot;{query}&quot;</p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function UserSearch({ placeholder = 'Search users...', className, onSelect }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const showDropdown = isOpen && query.length >= 2;

  // Fetch search results
  useEffect(() => {
    startTransition(async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setHasMore(false);
        return;
      }

      const { users, hasMore: more } = await searchUsers(debouncedQuery);
      setResults(users);
      setHasMore(more);
      setHighlightedIndex(-1);
    });
  }, [debouncedQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user selection
  const handleSelectUser = useCallback(
    (user: SearchUser) => {
      setIsOpen(false);
      setQuery('');
      onSelect?.(user);
    },
    [onSelect],
  );

  // Handle clearing search
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && results[highlightedIndex]) {
            handleSelectUser(results[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [showDropdown, results, highlightedIndex, handleSelectUser],
  );

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-md', className)}>
      {/* Search Input */}
      <InputGroup className="h-11 rounded-xl border-neutral-800 bg-neutral-900/50">
        <InputGroupAddon>
          <IconSearch className="text-neutral-500" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-11 placeholder:text-neutral-600"
          aria-label="Search users"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-results"
          role="combobox"
        />
        {query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={handleClear}
              aria-label="Clear search"
              className="rounded-full text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
            >
              <IconX />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          className={cn(
            'absolute top-full z-50 mt-2 w-full',
            'rounded-xl border border-neutral-800 bg-neutral-900/95 shadow-2xl backdrop-blur-xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
            'max-h-[320px] overflow-y-auto',
          )}
        >
          {isPending ? (
            // Loading state
            <div className="divide-y divide-neutral-800/50">
              <SearchResultSkeleton />
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </div>
          ) : results.length > 0 ? (
            // Results list
            <div className="p-1">
              {results.map((user, index) => (
                <SearchResultItem
                  key={user.id}
                  user={user}
                  isHighlighted={index === highlightedIndex}
                  onSelect={() => handleSelectUser(user)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                />
              ))}
              {hasMore && (
                <p className="px-3 py-2 text-center text-xs text-neutral-600">Type more to refine results...</p>
              )}
            </div>
          ) : (
            // Empty state
            <EmptyState query={query} />
          )}
        </div>
      )}
    </div>
  );
}
