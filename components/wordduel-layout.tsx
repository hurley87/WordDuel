'use client';

import { usePrivy } from '@privy-io/react-auth';
import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPRead } from '@/hooks/useXPRead';
import HowToPlay from './how-to-play';
import { Badge } from './ui/badge';
import { useAIRead } from '@/hooks/useAIRead';
import { useQuery } from '@tanstack/react-query';
import { getUserDuels } from '@/lib/db';
import { formatAddress } from '@/lib/utils';

export default function WordDuelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = usePrivy();
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;

  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const { data: gameBalance } = useAIRead({
    functionName: 'getTokenBalanceContract',
    args: [],
  });
  const XP = parseInt(xpBalance || '0') / 10 ** 18;
  const gameXP = parseInt(gameBalance || '0') / 10 ** 18;
  const { data: queryDuels } = useQuery({
    queryKey: ['duels', address],
    queryFn: () => getUserDuels(address),
  });
  const level = queryDuels?.length || 0;

  if (!ready) return <Loading />;

  function numWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      {user && (
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Badge>WordDuel | {numWithCommas(gameXP)} $XP</Badge>
          <HowToPlay>
            <Badge>
              {formatAddress(address)} | {numWithCommas(XP)} $XP | Lvl {level}
            </Badge>
          </HowToPlay>
        </div>
      )}
      {children}
    </>
  );
}
