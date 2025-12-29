import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SiteNav;
