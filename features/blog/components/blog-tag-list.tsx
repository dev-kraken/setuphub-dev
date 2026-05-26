import { Badge } from '@/components/ui/badge';

interface BlogTagListProps {
  tags: string[];
}

export function BlogTagList({ tags }: BlogTagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="secondary" className="font-inter text-xs lowercase">
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
