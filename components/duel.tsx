import { DUEL_STATE, formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from './icons';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export const Duel = ({ duel, route }: { duel: any; route: string }) => {
  const { wallet } = usePrivyWagmi();

  if (DUEL_STATE[duel?.state] === 'Cancelled') return null;

  let message = `${
    duel.challengerTwitter || formatAddress(duel.challenger)
  } ⚔️ ${duel.challengerOpponent || formatAddress(duel.opponent)}`;
  if (DUEL_STATE[duel?.state] === 'Created')
    message = `View ${route} #${duel.id.toString()} against ${
      duel.challengerTwitter || formatAddress(duel.challenger)
    }`;
  if (wallet?.address === duel.challenger)
    message = `View your ${route} #${duel.id.toString()}`;

  return (
    <Link href={`/${route}/${duel.id.toString()}`} className="w-full">
      <div className="flex justify-between rounded-none px-2 py-4 transition-all border-b border-accent hover:bg-accent hover:text-accent-foreground w-full">
        <p className="font-bold">{message}</p>
        <p className="font-bold flex flex-col items-center">
          <Icons.chevronRight />
        </p>
      </div>
    </Link>
  );
};
