import { type Icon, IconBrandGithub } from '@tabler/icons-react';
import { type Route } from 'next';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const SiteNav = () => {
  return (
    <NavigationMenu viewport={false} className="hidden md:block">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="font-oxanium bg-transparent text-base font-medium text-neutral-400 transition-colors hover:bg-transparent hover:text-neutral-100"
          >
            <Link
              href="/setups"
              title="Browse Setups"
              aria-label="Browse Setups"
              className="transition-colors hover:text-neutral-100"
            >
              Browse Setups
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-oxanium bg-transparent text-base font-medium text-neutral-400 transition-colors hover:bg-transparent hover:text-neutral-100">
              Tools
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem href="/tools/github-banner-generator" title="GitHub Banner Generator" icon={IconBrandGithub}>
                  Create custom SVG banners for GitHub READMEs. Free, themed, and export-ready.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SiteNav;

interface ListItemProps extends React.ComponentPropsWithoutRef<'li'> {
  title: string;
  children: React.ReactNode;
  href: string;
  icon: Icon;
}
const ListItem = ({ title, children, href, icon: IconComp, ...props }: ListItemProps) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href as Route<string>}
          title={title}
          aria-label={title}
          className="transition-colors hover:text-neutral-100"
        >
          <div className="flex items-start justify-start gap-2 text-sm">
            {IconComp && <IconComp className="size-12 text-neutral-400" strokeWidth={1.5} />}
            <div className="font-oxanium flex flex-col gap-1">
              <div className="text-base leading-none font-medium">{title}</div>
              <div className="text-muted-foreground line-clamp-2 text-sm">{children}</div>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
