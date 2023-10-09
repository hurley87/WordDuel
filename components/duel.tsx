import { useRead } from '@/hooks/useRead';
import { DUEL_STATE, formatAddress } from '@/lib/utils';
import { CheckSquare, Sword, Swords, XSquare } from 'lucide-react';
import Link from 'next/link';

export const Duel = ({ duelId }: { duelId: any }) => {
  const { data: duel, isLoading } = useRead({
    functionName: 'getDuel',
    args: [duelId],
  });

  if (DUEL_STATE[duel?.state] === 'Cancelled') return null;
  return (
    <div className={`flex`}>
      {isLoading && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isLoading && duel && (
        <Link href={`/duel/${duelId}`} className="w-full">
          <div className="flex space-x-4 rounded-none p-2 transition-all border-b border-accent hover:bg-accent hover:text-accent-foreground w-full">
            {DUEL_STATE[duel?.state] === 'Created' && (
              <Sword className="w-9 h-9" />
            )}
            {DUEL_STATE[duel?.state] === 'Accepted' && (
              <Swords className="w-9 h-9" />
            )}
            {DUEL_STATE[duel?.state] === 'Finished' && (
              <CheckSquare className="w-9 h-9" />
            )}
            {DUEL_STATE[duel?.state] === 'Cancelled' && (
              <XSquare className="w-9 h-9" />
            )}
            <div className="space-y-1">
              <p className="text-xs font-medium leading-none pt-1">
                {formatAddress(duel.challenger)} ⚔️{' '}
                {formatAddress(duel.opponent)}
              </p>
              <p className="text-xs text-muted-foreground">
                {DUEL_STATE[duel?.state] === 'Accepted' &&
                  `#${duelId} accepted: ${
                    Number(duel.moveAmount) / 10 ** 18
                  } ETH per move`}
                {DUEL_STATE[duel?.state] === 'Created' &&
                  `#${duelId}: ${
                    Number(duel.moveAmount) / 10 ** 18
                  } ETH per move`}
                {DUEL_STATE[duel?.state] === 'Finished' && `Game over`}
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};
