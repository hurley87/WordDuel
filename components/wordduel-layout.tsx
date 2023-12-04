'use client';

import { usePrivy } from '@privy-io/react-auth';
import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import HowToPlay from './how-to-play';
import { Badge } from './ui/badge';
import HowToProfile from './how-to-profile';
import { useBalance } from 'wagmi';
import { formatAddress } from '@/lib/utils';

export default function WordDuelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = usePrivy();
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;

  const { data: userETH } = useBalance({
    address,
  });
  const balance = parseFloat(userETH?.formatted || '0');
  const gameContract = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const { data: gameETH } = useBalance({
    address: gameContract,
  });

  const gameBalance = parseFloat(gameETH?.formatted || '0');

  if (!ready) return <Loading />;

  return (
    <>
      {user && (
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <HowToPlay>
            <Badge>WordDuel | {gameBalance.toFixed(2)} ETH</Badge>
          </HowToPlay>
          <HowToProfile balance={balance.toFixed(2)}>
            <Badge>
              {formatAddress(address)} | {balance.toFixed(2)} ETH
            </Badge>
          </HowToProfile>
        </div>
      )}
      {children}
    </>
  );
}
