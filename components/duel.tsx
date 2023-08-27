import { useRead } from '@/hooks/useRead';
import { DUEL_STATE } from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';

export const Duel = ({ duelId }: { duelId: any }) => {
  const { data: duel, isLoading } = useRead({
    functionName: 'getDuel',
    args: [duelId],
  });

  return (
    <div className={`flex`}>
      <div className="divider"></div>
      {isLoading && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isLoading && duel && (
        <Link href={`/duel/${duelId}`} className="w-full">
          <div className="flex space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground w-full">
            <BellIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{duel.email}</p>
              <p className="text-sm text-muted-foreground">
                {DUEL_STATE[duel.state]}
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};
