import { useFreeRead } from '@/hooks/useFreeRead';
import { DUEL_STATE, formatAddress } from '@/lib/utils';
import { CheckSquare, Sword, Swords, XSquare } from 'lucide-react';
import Link from 'next/link';

export const DuelFree = ({ duelId }: { duelId: any }) => {
  const { data: duel, isLoading } = useFreeRead({
    functionName: 'getDuel',
    args: [duelId],
  });

  if (!duel) return null;
  if (DUEL_STATE[duel?.state] === 'Cancelled') return null;

  return (
    <div className={`flex w-full`}>
      {isLoading && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isLoading && duel && (
        <Link href={`/practice/${duelId}`} className="w-full">
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
                  `Practice #${duelId} accepted`}
                {DUEL_STATE[duel?.state] === 'Created' &&
                  `Practice #${duelId} proposed`}
                {DUEL_STATE[duel?.state] === 'Cancelled' &&
                  `Practice #${duelId} cancelled`}
                {DUEL_STATE[duel?.state] === 'Finished' &&
                  `Practice #${duelId} finished`}
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};
