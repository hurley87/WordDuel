import { DUEL_STATE, formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from './icons';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export const Duel = ({ duel, route }: { duel: any; route: string }) => {
  const { wallet } = usePrivyWagmi();

  let message = `#${duel.id.toString()}: ${formatAddress(
    duel.challenger
  )} ⚔️ ${formatAddress(duel.opponent)} ${
    DUEL_STATE[duel?.state] === 'Finished' ? '✅' : ''
  }`;
  if (DUEL_STATE[duel?.state] === 'Created' && route === 'duel')
    message = `#${duel.id.toString()}: ${route}  against ${formatAddress(
      duel.challenger
    )} ${`(${Number(duel.moveAmount) / 10 ** 18} ETH)`}`;
  if (DUEL_STATE[duel?.state] === 'Created' && route !== 'duel')
    message = `#${duel.id.toString()}: ${route}  against ${formatAddress(
      duel.challenger
    )}`;
  if (wallet?.address === duel.challenger)
    message = `#${duel.id.toString()}: view your ${route} ${
      DUEL_STATE[duel?.state] === 'Finished' ? '✅' : ''
    }`;
  if (DUEL_STATE[duel?.state] === 'Cancelled')
    message = `#${duel.id.toString()}: cancelled by ${formatAddress(
      duel.challenger
    )}`;
  return (
    <Link href={`/${route}/${duel.id.toString()}`} className="w-full">
      <div className="flex justify-between rounded-none px-2 py-4 transition-all border-b border-accent hover:bg-accent hover:text-accent-foreground w-full">
        <p className="font-medium text-sm">{message}</p>
        <p className="font-bold flex flex-col items-center">
          <Icons.chevronRight />
        </p>
      </div>
    </Link>
  );
};
