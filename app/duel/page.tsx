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
      <div className="mx-auto flex flex-col justify-center space-y-6 max-w-sm py-24">
        <GetETH />
      </div>
    );

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 max-w-sm py-20">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Create a duel where you and an opponent take turns guessing a 5-letter
          word. You decide how much ETH is added to the pot for each guess.
          {"You'll"} guess first and whoever guesses right wins the pot.
        </p>
      </div>
      <NewDuel />
      <p className="text-xs text-muted-foreground">
        * 0.000777 ETH will be charged + gas
      </p>
    </div>
  );
}
