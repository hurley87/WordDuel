'use client';

import { NewDuel } from '@/components/new-duel';
import { useBalance } from 'wagmi';
import GetETH from '@/components/get-eth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export default function NewDuelPage() {
  const { wallet } = usePrivyWagmi();
  const { data, isLoading } = useBalance({
    address: wallet?.address as `0x${string}`,
  });
  const balance = parseFloat(data?.formatted || '1');

  if (!isLoading && balance === 0)
    return (
      <div className="mx-auto flex flex-col justify-center space-y-6 max-w-md py-24">
        <GetETH />
      </div>
    );

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
      <NewDuel />
      <p className="text-xs text-muted-foreground">
        * 0.000777 ETH will be charged + gas
      </p>
    </div>
  );
}
