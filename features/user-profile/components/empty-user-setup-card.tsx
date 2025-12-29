import { IconHeartBrokenFilled } from '@tabler/icons-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

const EmptyUserSetupCard = () => {
  return (
    <Empty>
      <EmptyHeader className="items-center">
        <EmptyMedia variant="default">
          <IconHeartBrokenFilled className="size-12 animate-pulse text-red-500/70" />
        </EmptyMedia>
        <EmptyTitle className="font-oxanium text-2xl font-semibold text-white">No public setups</EmptyTitle>
        <EmptyDescription>No public setups yet.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export { EmptyUserSetupCard };
